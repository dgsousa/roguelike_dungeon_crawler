import React, {Component, PropTypes, createElement} from "react";
import {connect} from "react-redux";
import * as ROT from "../../bower_components/rot.js/rot.js";
import ActionCreators from "../actions/index.jsx";
import World from "../scripts/world.js";
import { playerTemplate} from "../scripts/entities.js";




class App extends Component {		
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const {world, createWorld} = this.props;
		createWorld(world);
		const player = {...playerTemplate, coords: this.emptyCoords([])};
	}

	// componentDidUpdate(prevProps) {
	// 	if(this.props.world !== prevProps.world) {
	// 		this.setupBoard();
	// 	}
	// }

	// restart() {
	// 	const {width, height, depth, createWorld} = this.props;
	// 	createWorld(new World(width, height, depth));
	// }

	// setupBoard() {
	// 	const {fillFloor} = this.props;
	// 	const entities = this.generateEntities();
	// 	const items = this.generateItems();
	// 	const message = ["Welcome to the Dungeon!"];
	// 	const occupiedSquares = this.getOccupiedSquares(entities);
	// 	const itemSquares = this.getOccupiedSquares(items);
	// 	fillFloor(entities, items, 0, message, occupiedSquares, itemSquares);
	// }


	// generateItems(floor = this.props.floor) {
	// 	const items = [];
	// 	const weapon = {...weaponTemplate(floor), coords: this.emptyCoords(items, floor)};
	// 	items.push(weapon);
	// 	for(let i = 0; i < 5; i++) {
	// 		const food = {...foodTemplate(floor), coords: this.emptyCoords(items, floor)};
	// 		items.push(food);
	// 	}
	// 	return items;
	// }

	// generateEntities(floor = this.props.floor) {
	// 	const entities = [];
	// 	const player = {...playerTemplate, coords: this.emptyCoords(entities, floor)};
	// 	entities.push(player);
	// 	for(let i = 0; i < 10; i++) {
	// 		const enemy = {...enemyTemplate(floor), coords: this.emptyCoords(entities, floor)};
	// 		entities.push(enemy);
	// 	}
	// 	if(floor == 3) {
	// 		const boss = {...enemyTemplate(0), ...bossTemplate, coords: this.emptyCoords(entities, floor)};
	// 		entities.push(boss);
	// 	}
	// 	return entities;
	// }


	emptyCoords(entities, floor = this.props.floor) {
		const {width, height} = this.props;
		let x, y;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (!this.isEmptySquare([x, y], floor));
		return [x, y];
	}


	scroll(e) {
		e.preventDefault();
		e.keyCode === ROT.VK_I ? this.scrollScreen([0, -1]) :
		e.keyCode === ROT.VK_M ? this.scrollScreen([0, 1]) :
		e.keyCode === ROT.VK_J ? this.scrollScreen([-1, 0]) :
		e.keyCode === ROT.VK_K ? this.scrollScreen([1, 0]) : false;
	}

	scrollScreen([x, y]) {
		const {width, height, entities} = this.props;
		const player = entities[0];
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
		const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		const playerCoords = [playerX, playerY];

		this.move(playerCoords);
	}


	move(playerCoords) {
		if(this.isEmptySquare(playerCoords) && !this.entityAt(playerCoords, this.props.entities) ) {
			const { entities, moveEntities } = this.props;
			const {player, message, items} = this.checkForItem({...entities[0], coords: playerCoords});
			const enemies = this.moveEnemies(playerCoords);
			const occupiedSquares = this.getOccupiedSquares([ player, ...enemies]);
			moveEntities([ player, ...enemies], items, message, occupiedSquares);
			return true;
		}
		return false;
	}

	// nextFloor(playerCoords) {
	// 	if(this.isStaircase(playerCoords)) {
	// 		const { entities, floor, fillFloor } = this.props;
	// 		const player = {...entities[0], coords: playerCoords};
	// 		const enemies = this.generateEntities(floor + 1).slice(1);
	// 		const items = this.generateItems(floor + 1);
	// 		const message = [`You are now on floor number ${floor + 2}`];
	// 		const occupiedSquares = this.getOccupiedSquares([player, ...enemies]);
	// 		const itemSquares = this.getOccupiedSquares(items);
	// 		fillFloor([player, ...enemies], items, floor + 1, message, occupiedSquares, itemSquares);
	// 		return true;
	// 	}
	// 	return false;
	// }

	// attackEntity(playerCoords) {
	// 	const entity = this.entityAt(playerCoords, this.props.entities);
	// 	if(entity) {
	// 		const { entities, fight } = this.props;
	// 		const player = {...entities[0] };
	// 		player.attack(entity); 
	// 		const newEnemies = this.damageOrRemoveEntity(entity, [...entities.splice(1)]);
	// 		const gameEnd = this.checkGameStatus(player);
	// 		const occupiedSquares = this.getOccupiedSquares([player, ...newEnemies]);
	// 		fight([player, ...newEnemies], player._message, gameEnd, occupiedSquares);
	// 	}
	// 	return false;
	// }

	// checkForItem(player) {
	// 	const { items } = this.props;
	// 	const message = [];
	// 	items.filter((item) => {
	// 		if(item.coords[0] == player.coords[0] && item.coords[1] == player.coords[1]) {
	// 			player._hp += item._hp || 0;
	// 			player._weapon = item._weapon || player._weapon;
	// 			player._attackValue += item._attackValue || 0;
	// 			message.push(`You picked up a ${item._type}`);
	// 		} else {
	// 			return item;
	// 		}
	// 	});
	// 	return { player, message, items };
	// }

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

	// entityAt([x, y], entities) {
	// 	if(entities) {
	// 		for(let i = 0; i < entities.length; i++) {
	// 			if(entities[i].coords[0] === x && entities[i].coords[1] === y) {
	// 				return { ...entities[i] };
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }


	// moveEnemies(playerCoords) {
	// 	const { floor, entities } = this.props;
	// 	const newEntities = entities.splice(1).map((entity) => {
	// 		const xOffset = Math.floor(Math.random() * 3) - 1;
	// 		const yOffset = Math.floor(Math.random() * 3) - 1;
	// 		const coords = [entity.coords[0] + xOffset, entity.coords[1] + yOffset];
	// 		return 	this.isEmptySquare(coords, floor) 	&& !(coords[0] == playerCoords[0] && coords[1] == playerCoords[1]) 	?
	// 					{...entity, coords: coords} : entity;
	// 	});
	// 	return newEntities;
	// }


	getTileClass(x, y) {
		const {world, floor} = this.props;
		const map = world._regions[floor];
		const chars = {
			"0": "wall",
			"1": "floor",
			"2": "floor",
			"3": "floor",
			"5": "stairs",
			"6": "grey"
		};
		return 	chars[map[x][y]];
	}


	setUpBoard() {
		const { width, height, player } = this.props;
		const screenX = Math.max(0, Math.min(0 - 12, width - 25));
		const screenY = Math.max(0, Math.min(0 - 7, height - 15));
		const rows = [];
		for(let y = screenY; y < screenY + 15; y++) {
			let row = [];
			for(let x = screenX; x < screenX + 25; x++) {
				const tileClass = this.getTileClass(x, y);
				row.push(createElement("div", {	
					className: "tile " + tileClass, 
					key: x+"x"+y, 
					style: {left: 30 * (x - screenX)}}, " "));
			}
			rows.push(createElement("div", {
				className: "row", 
				key: y
			}, row));
		}
		return rows;
	}

	// getVisibleCells(playerCoords) {
	// 	const {world, floor} = this.props;
	// 	const visibleCells = {};
	// 	world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y) => {
	// 		visibleCells[`${x},${y},${floor}`] = true;
	// 	});
	// 	return visibleCells;
	// }

	// checkGameStatus(player) {
	// 	return 	player._hp <= 0 ? "You Lose!" : 
	// 			player._experience > 1000 ? "You Win!" : false;
	// }

	// damageOrRemoveEntity(enemy, entities) {
	// 	const newEntities = [];
	// 	entities.forEach((entity) => {
	// 		if(entity.coords[0] != enemy.coords[0] || entity.coords[1] != enemy.coords[1]) {
	// 			newEntities.push(entity);
	// 		} else if(enemy._hp > 0) {
	// 			newEntities.push(enemy);
	// 		}
	// 	});
	// 	return newEntities;
	// }

	getOccupiedSquares(entities) {
		const occupiedSquares = {};
		entities.forEach((entity) => {
			occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type;
		});
		return occupiedSquares;
	}


	render() {
		const rows = this.setUpBoard();
		return (
			<div>
				<div
					className="board"
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>
					{rows}
				</div>
			</div>	
		);
	}
}


const mapStateToProps = (state, ownProps) => ({
	world: state.world || new World(ownProps.width, ownProps.height, ownProps.depth),
	floor: state.floor,
	width: ownProps.width,
	height: ownProps.height
});

export default connect(
	mapStateToProps,
	{
		createWorld: ActionCreators.createWorld,
		fillFloor: ActionCreators.fillFloor
	}
)(App);

React.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	depth: PropTypes.number.isRequired
};








