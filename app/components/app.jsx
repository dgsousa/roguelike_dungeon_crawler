import React, {Component, PropTypes, createElement} from 'react';
import {connect} from "react-redux";
import * as ROT from '../../bower_components/rot.js/rot.js';
import {WorldActionCreators, PlayerActionCreators, LightActionCreators, EntityActionCreators } from "../actions/index.jsx";
import World from "../scripts/world.js";
import { playerTemplate, enemyTemplate, bossTemplate } from "../scripts/entities.js";
import Entity from "../scripts/entity.js";
import {Item, foodTemplate, weaponTemplate} from "../scripts/item.js";


class App extends Component {		
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const {world, floor, createWorld, addEntities} = this.props;
		addEntities(this.generateEntities());
		createWorld(world);
	}

	// generateItems() {
	// 	const items = [];
	// 	const weapon
	// }



	generateEntities(floor = this.props.floor) {
		const entities = [];
		const player = new Entity(playerTemplate);
		player.coords = this.emptyCoords(entities, floor);
		entities.push(player);
		for(let i = 0; i < 10; i++) {
			const entity = new Entity(enemyTemplate(floor));
			entity.coords = this.emptyCoords(entities, floor);
			entities.push(entity);
		}
		if(floor == 3) {
			const boss = new Entity(bossTemplate);
			boss.coords = this.emptyCoords(entities, floor);
			entities.push(boss);
		}
		return entities;
	}

	

	emptyCoords(entities, floor = this.props.floor) {
		const {width, height, world, occupiedSquares} = this.props;
		let x, y;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (!this.isEmptySquare([x, y], floor) || this.entityAt([x, y], entities));
		return [x, y];
	};


	scroll(e) {
		e.preventDefault();
		e.keyCode === ROT.VK_I ? this.scrollScreen([0, -1]) :
		e.keyCode === ROT.VK_M ? this.scrollScreen([0, 1]) :
		e.keyCode === ROT.VK_J ? this.scrollScreen([-1, 0]) :
		e.keyCode === ROT.VK_K ? this.scrollScreen([1, 0]) : false
	};

	scrollScreen([x, y]) {
		const {width, height, world, entities, floor} = this.props;
		const player = entities[0];
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
	 	const playerCoords = [playerX, playerY];

	 	this.move(playerCoords) ||
	 	this.nextFloor(playerCoords) 
	 	
	}

	nextFloor(playerCoords) {
		if(this.isStaircase(playerCoords)) {
			const {entities, floor, goUpstairs} = this.props;
			const newEntities = [new Entity({...entities[0], coords: playerCoords}), ...this.generateEntities(floor + 1).slice(1)];
			goUpstairs(newEntities);
		}
	}

	move(playerCoords) {
		if(this.isEmptySquare(playerCoords) && !this.entityAt(playerCoords, this.props.entities) ) {
			const {entities, moveEntities} = this.props;
			moveEntities([new Entity({...entities[0], coords: playerCoords}), ...this.moveEnemies(playerCoords)]);
		}
	}

	isStaircase([x, y]) {
		const { world, floor } = this.props;
		return world._regions[floor][x][y] == 5;
	}

	isEmptySquare([x, y], floor = this.props.floor) {
		return this.inBounds([x, y]) && this.props.world._regions[floor][x][y] && !this.isStaircase([x, y]);
	}

	inBounds([x, y]) {
		const {width, height} = this.props;
		return x >= 0 && x < width && y >= 0 && y < height;
	}

	entityAt([x, y], entities) {
		if(entities) {
			for(let i = 0; i < entities.length; i++) {
				if(entities[i].coords[0] === x && entities[i].coords[1] === y) {
					return entities[i];
				}
			}
		}
		return false;
	}


	moveEnemies(playerCoords) {
		const {world, floor, entities, width, height} = this.props;
		const newEntities = entities.splice(1).map((entity) => {
			const xOffset = Math.floor(Math.random() * 3) - 1;
			const yOffset = Math.floor(Math.random() * 3) - 1;
			const coords = [entity.coords[0] + xOffset, entity.coords[1] + yOffset];
			return 	this.isEmptySquare(coords, floor) && 
					!(coords[0] == playerCoords[0] && coords[1] == playerCoords[1]) ?
						new Entity({...entity, coords: coords}):
						new Entity(entity);
		})
		return newEntities;
	}


	getTileClass(x, y) {
		const {occupiedSquares, itemSquares, world, floor, entities, lightsOn} = this.props;
		const player = entities[0];
		const visibleCells = this.getVisibleCells(player.coords);
		const map = world._regions[floor]
		const chars = {
			'0': 'wall',
			'1': 'floor',
			'2': 'floor',
			'3': 'floor',
			'5': 'stairs',
			'6': 'grey'
		};
		return 	visibleCells[`${x},${y},${floor}`] 	|| lightsOn ? 
					occupiedSquares[`${x}x${y}`] 	|| 
					itemSquares[`${x}x${y}`] 		|| 
					chars[map[x][y]] : chars[6];
	}


	setUpBoard() {
		const { width, height, world, entities } = this.props;
		const player = entities[0];
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
		const rows = [];
		for(let y = screenY; y < screenY + 15; y++) {
			let row = [];
			for(let x = screenX; x < screenX + 25; x++) {
				const tileClass = this.getTileClass(x, y);
				row.push(createElement("div", {	className: "tile " + tileClass, 
												key: x+"x"+y, 
												style: {left: 30 * (x - screenX)}}, " "));
			}
			rows.push(createElement("div", {className: "row", key: y}, row));
		}
		return rows;
	}

	getVisibleCells(playerCoords) {
		const {world, floor} = this.props;
		const visibleCells = {};
		world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y, radius, visiblitiy) => {
			visibleCells[`${x},${y},${floor}`] = true;
		})
		return visibleCells;
	}


	render() {
		const {lightsOn, switchLights} = this.props;
		const rows = this.setUpBoard();
		return (
			<div>
				<div className="message"></div>
				
				<div
					className="board"
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>
					{rows}
					<button onClick={switchLights}>
						{lightsOn ? "Turn Lights Off" : "Turn Lights On"}
					</button>
				</div>
			</div>	
		)
	}
	
}



const mapStateToProps = (state, ownProps) => ({
	world: state.world || new World(ownProps.width, ownProps.height, ownProps.depth),
	floor: state.floor,
	width: ownProps.width,
	height: ownProps.height,
	entities: state.entities,
	occupiedSquares: state.occupiedSquares,
	itemSquares: state.itemSquares,
	lightsOn: state.lightsOn
})


export default connect(
	mapStateToProps,
	{
		createWorld: WorldActionCreators.createWorld,
		goUpstairs: PlayerActionCreators.goUpstairs,
		moveEntities: EntityActionCreators.moveEntities,
		addEntities: EntityActionCreators.addEntities,
		switchLights: LightActionCreators.switchLights
	}
)(App);








