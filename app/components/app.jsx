import React, {Component, PropTypes, createElement} from "react";
import {connect} from "react-redux";
//import * as ROT from "../../bower_components/rot.js/rot.js";
import ActionCreators from "../actions/index.jsx";
//import World from "../scripts/world.js";
//import { playerTemplate} from "../scripts/entities.js";




class App extends Component {		

	componentWillMount() {
		const { setupFloor } = this.props;
		setupFloor();
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
		const {world, floor, player, occupiedSquares, lightsOn } = this.props;
		const map = world._regions[floor];
		const visibleCells = this.getVisibleCells(player.coords);
		const chars = {
			"0": "wall",
			"1": "floor",
			"2": "floor",
			"3": "floor",
			"5": "stairs",
			"6": "grey"
		};
		return 	visibleCells[`${x},${y},${floor}`] || lightsOn ?
					occupiedSquares[`${x}x${y}`] || chars[map[x][y]] :
					chars["6"];
	}


	setUpBoard() {
		const { width, height, entities } = this.props;
		console.log(entities);
		const player = entities[0];
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
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

	getVisibleCells(playerCoords) {
		const {world, floor} = this.props;
		const visibleCells = {};
		world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y) => {
			visibleCells[`${x},${y},${floor}`] = true;
		});
		return visibleCells;
	}

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

	


	render() {
		const { scroll, lightsOn, switchLights } = this.props;
		const rows = this.setUpBoard();
		return (
			<div>
				<div
					className="board"
					tabIndex={"0"}
					onKeyDown={scroll}>
					{rows}
					<button 
						className="lights"
						onClick={switchLights}>
						{lightsOn ? "Turn Lights Off" : "Turn Lights On"}
					</button>
				</div>
			</div>	
		);
	}
}


const mapStateToProps = (state) => ({
	world: state.world,
	floor: state.floor,
	entities: state.entities,
	occupiedSquares: state.occupiedSquares,
	width: state.width,
	height: state.height,
	depth: state.depth,
	lightsOn: state.lightsOn
});

export default connect(
	mapStateToProps,
	{
		createWorld: ActionCreators.createWorld,
		setupFloor: ActionCreators.setupFloor,
		scroll: ActionCreators.scroll,
		switchLights: ActionCreators.switchLights
	}
)(App);

React.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	depth: PropTypes.number.isRequired
};








