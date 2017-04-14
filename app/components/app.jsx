import React, {Component, PropTypes, createElement} from 'react';
import {connect} from "react-redux";
import {WorldActionCreators, PlayerActionCreators} from "../actions/index.jsx";
import World from "./scripts/world.js";
import Entity from "./scripts/entity.js";
import { playerTemplate, entityTemplate, bossTemplate } from "./scripts/entities.js";



class App extends Component {		
	constructor(props) {
		super(props);
	}


	componentWillMount() {
		const {createWorld, addPlayer, world} = this.props;
		createWorld(world);
		addPlayer(new Entity(playerTemplate), this.emptyCoords());
	}


	emptyCoords() {
		const {width, height, floor, world} = this.props;
		let x, y;
		do {
			x = Math.floor(Math.random() * width);
			y = Math.floor(Math.random() * height);
		} while (!world._regions[floor][x][y]);
		return [x, y];
	}


	setUpBoard() {
		const { width, height, world, floor, occupiedSquares, player} = this.props;
		const map = world._regions[floor];
		console.log(map[player.coords[0]][player.coords[1]]);
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
		const chars = {
			'0': 'wall',
			'1': 'floor',
			'2': 'floor',
			'3': 'floor',
			'5': 'stairs'
		};
		const rows = [];
		for(let y = screenY; y < screenY + 15; y++) {
			let row = [];
			for(let x = screenX; x < screenX + 25; x++) {
				row.push(createElement("div", {	className: "tile " + (occupiedSquares[`${x}x${y}`] || chars[map[x][y]]), 
												key: x+"x"+y, 
												style: {left: 30 * (x - screenX)}}, " "));
			}
			rows.push(createElement("div", {className: "row", key: y}, row));
		}
		return rows;
	}

	render() {
		const rows = this.setUpBoard();
		return (
			<div>
				<div className="message"></div>
				<div className="board">
					{rows}
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
	player: state.player,
	occupiedSquares: state.occupiedSquares
})


export default connect(
	mapStateToProps,
	{
		createWorld: WorldActionCreators.createWorld,
		addPlayer: PlayerActionCreators.addPlayer
	}
)(App);








