import React, {Component, PropTypes, createElement} from 'react';
import {connect} from "react-redux";
import * as ROT from '../../bower_components/rot.js/rot.js';
import {WorldActionCreators, PlayerActionCreators, LightActionCreators, EntityActionCreators } from "../actions/index.jsx";
import World from "../scripts/world.js";
import { playerTemplate, enemyTemplate, bossTemplate } from "../scripts/entities.js";
import Entity from "../scripts/entity.js";


class App extends Component {		
	constructor(props) {
		super(props);
	}

	entityMenu(floor, num) {
		return [
			[playerTemplate, 1],
			[enemyTemplate(floor), num],
			[bossTemplate, floor == 3 ? 1 : 0]
		]
		
	}

	componentWillMount() {
		const {world, floor, createWorld, addEntities} = this.props;
		const menu = this.entityMenu(floor, 10);
		addEntities(this.generateEntities(menu));
		createWorld(world);
	}


	generateEntities(menu, floor = this.props.floor) {
		const entities = [];
		for(let i = 0; i < menu.length; i++) {
			for(let j = 0; j < menu[i][1]; j++) {
				const entity = new Entity(menu[i][0]);
				entity.coords = this.emptyCoords(entities, floor);
				entities.push(entity);
			}
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

	entityAt(coords, entities) {
		if(entities) {
			for(let i = 0; i < entities.length; i++) {
				if(entities[i].coords[0] === coords[0] && entities[i].coords[1]) {
					return entities[i];
				}
			}
		}
		return false;
	}

	scroll(e) {
		e.preventDefault();
		e.keyCode === ROT.VK_I ? this.scrollScreen([0, -1]) :
		e.keyCode === ROT.VK_M ? this.scrollScreen([0, 1]) :
		e.keyCode === ROT.VK_J ? this.scrollScreen([-1, 0]) :
		e.keyCode === ROT.VK_K ? this.scrollScreen([1, 0]) : false
	};

	scrollScreen(coords) {
		const {width, height, world, entities, floor} = this.props;
		const player = entities[0];
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + coords[0]));
	 	const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + coords[1]));
	 	const playerCoords = [playerX, playerY];

	 	this.nextFloor(playerCoords) ||
	 	this.move(playerCoords);
	}

	nextFloor(coords) {
		if(this.isStaircase(coords)) {
			const {entities, floor, goUpstairs} = this.props;
			const menu = this.entityMenu(floor + 1, 10);
			const newEntities = [new Entity({...entities[0], coords: coords}), ...this.generateEntities(menu, floor + 1).slice(1)];
			goUpstairs(newEntities);
		}
	}

	move(coords) {
		if(this.isEmptySquare(coords)) {
			const {entities, movePlayer} = this.props;
			movePlayer(new Entity({...entities[0], coords: coords}), entities[0].coords);
		}
	}

	isStaircase(coords) {
		const { world, floor } = this.props;
		return world._regions[floor][coords[0]][coords[1]] == 5;
	}

	isEmptySquare(coords, floor = this.props.floor) {
		return this.props.world._regions[floor][coords[0]][coords[1]];
	}


	getTileClass(x, y) {
		const {occupiedSquares, world, floor, entities, lightsOn} = this.props;
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
		return visibleCells[`${x},${y},${floor}`] || lightsOn ? occupiedSquares[`${x}x${y}`] || chars[map[x][y]] : chars[6];
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
	lightsOn: state.lightsOn
})


export default connect(
	mapStateToProps,
	{
		createWorld: WorldActionCreators.createWorld,
		addPlayer: PlayerActionCreators.addPlayer,
		movePlayer: PlayerActionCreators.movePlayer,
		goUpstairs: PlayerActionCreators.goUpstairs,
		addEntities: EntityActionCreators.addEntities,
		switchLights: LightActionCreators.switchLights

	}
)(App);








