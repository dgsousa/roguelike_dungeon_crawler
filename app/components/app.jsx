import React, {Component, PropTypes} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as WorldActionCreators from "../actions/world.jsx";
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';
import Message from './message.jsx';
import Stats from './stats.jsx';
import Restart from "./restart.jsx";
import Entity from "./scripts/entity.js";
import {Item, foodTemplate, weaponTemplate} from "./scripts/item.js";
import { playerTemplate, enemyTemplate, bossTemplate } from "./scripts/entities.js";
import World from "./scripts/world.js";
import * as Sprint from "sprintf-js";



class App extends Component {	
	constructor(props) {
		super(props);
	};

	componentWillMount() {
		const {dispatch, width, height, depth} = this.props;
		const world = new World(width, height, depth);
		const action = WorldActionCreators.createWorld(world);
		dispatch(action);
	}
	
	

	createGame() {

		// const world = new World(width, height, depth);
		// const map = world._regions[0];
		// const player = this.generateEntity(playerTemplate, map);
		
	};

	//Navigation functions

	// scroll(e) {
	// 	e.preventDefault();
	// 	e.keyCode === ROT.VK_I ? this.scrollScreen(0, -1) :
	// 	e.keyCode === ROT.VK_M ? this.scrollScreen(0, 1) :
	// 	e.keyCode === ROT.VK_J ? this.scrollScreen(-1, 0) :
	// 	e.keyCode === ROT.VK_K ? this.scrollScreen(1, 0) : false
	// };

	// updateCoords(x, y) {
	// 	const {width, height} = this.props;
	// 	const {player} = this.state;
	// 	const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
	//  	const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
	// 	return {
	// 		playerCoords: [playerX, playerY]
	// 	}
	// }

	// scrollScreen(x, y) {
	// 	const {playerCoords} = this.updateCoords(x, y);
	// 	const {world, floor} = this.state;
	// 	const map = world._regions[floor];
	// 	this.move(playerCoords, map);
	// }

	// move(playerCoords, map) {
	// 	if(map[playerCoords[0]][playerCoords[1]]) {
	// 		const player = Object.assign(new Entity(), this.state.player, {coords: playerCoords});
	// 		this.setState({
	// 			player: player
	// 		})
	// 	}
	// }

	// initialize(map) {
	// 	let x, y;
	// 	do {
	// 		x = Math.floor(Math.random() * this.props.width);
	// 		y = Math.floor(Math.random() * this.props.height);
	// 	} while (!map[x][y]);
	// 	return [x, y];
	// }

	// generateEntity(template, map) {
	// 	let entity = new Entity(template);
	// 	entity.coords = this.initialize(map);
	// 	return entity;
	// }
	
	render() {
		const {width, height, world, floor} = this.props;
		console.log(world);
		//const map = world._regions[floor];
		return (
			<div>
				<div className="message"></div>	
				<button onClick={this.updateMap}></button>		
				
				

			</div>
			
		)
	}
}

const mapStateToProps = (state) => (
	{
		world: state.world
	}
)	


export default connect(mapStateToProps)(App);










