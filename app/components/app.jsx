import React, {Component, PropTypes, createElement} from 'react';
import {connect} from "react-redux";
import * as ROT from '../../bower_components/rot.js/rot.js';
import {WorldActionCreators, PlayerActionCreators} from "../actions/index.jsx";
import World from "../scripts/world.js";
import { playerTemplate, entityTemplate, bossTemplate } from "../scripts/entities.js";



class App extends Component {		
	constructor(props) {
		super(props);
	}


	componentWillMount() {
		const {createWorld, addPlayer, world} = this.props;
		createWorld(world);
		addPlayer(playerTemplate, this.emptyCoords());
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

	scroll(e) {
		e.preventDefault();
		e.keyCode === ROT.VK_I ? this.scrollScreen(0, -1) :
		e.keyCode === ROT.VK_M ? this.scrollScreen(0, 1) :
		e.keyCode === ROT.VK_J ? this.scrollScreen(-1, 0) :
		e.keyCode === ROT.VK_K ? this.scrollScreen(1, 0) : false
	};

	scrollScreen(x, y) {
		const {width, height, player, world, floor, movePlayer, goUpstairs} = this.props;
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));

	 	if(world._regions[floor][playerX][playerY] == 5) goUpstairs(player.coords, [playerX, playerY]);
	 	if(world._regions[floor][playerX][playerY]) movePlayer(player.coords, [playerX, playerY]);
	}

	getTileClass(x, y) {
		const {occupiedSquares, world, floor, player} = this.props;
		const visibleCells = this.getVisibleCells(player.coords);
		const map = world._regions[floor]
		const chars = {
			'0': 'wall',
			'1': 'floor',
			'2': 'floor',
			'3': 'floor',
			'5': 'stairs'
		};
		return visibleCells[`${x}x${y}`] ? occupiedSquares[`${x}x${y}`] || chars[map[x][y]] : 
	}


	setUpBoard() {
		const { width, height, world, player} = this.props;
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
			visibleCells[x + ',' + y + ',' + floor] = true;
		})
		return visibleCells;
	}

	render() {
		const rows = this.setUpBoard();
		return (
			<div>
				<div className="message"></div>
				<div 
					className="board"
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>
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
		addPlayer: PlayerActionCreators.addPlayer,
		movePlayer: PlayerActionCreators.movePlayer,
		goUpstairs: PlayerActionCreators.goUpstairs
	}
)(App);








