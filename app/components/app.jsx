import React, {Component, PropTypes, createElement} from "react";
import {connect} from "react-redux";
import { createWorld, setupFloor, scroll } from "../actions/index.jsx";
import Stats from "./stats.jsx";
import Restart from "./restart.jsx";
import Message from "./message.jsx";
import Lights from "./lights.jsx";




class App extends Component {		

	componentWillMount() {
		const { setupFloor } = this.props;
		setupFloor();
	}

	setUpBoard() {
		const { width, height, entities: [player] } = this.props;
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

	getTileClass(x, y) {
		const {world, floor, entities: [player], occupiedSquares, lightsOn } = this.props;
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


	
	render() {
		const { scroll } = this.props;
		const rows = this.setUpBoard();
		return (
			<div>
				<Message />
				<div
					className="board"
					tabIndex={"0"}
					onKeyDown={scroll}>
					<Restart />			
					<Stats />
					{rows}
					<Lights />
				</div>
			</div>	
		);
	}
}


const mapStateToProps = (state) => ({
	world: state.world,
	floor: state.floor,
	player: state.entities[0],
	occupiedSquares: state.occupiedSquares,
	lightsOn: state.lightsOn,
	width: state.width,
	height: state.height,
	depth: state.depth,
	
});



export default connect(
	mapStateToProps,
	{
		createWorld: createWorld,
		setupFloor: setupFloor,
		scroll: scroll
	}
)(App);

React.propTypes = {
	world: PropTypes.array.isRequired,
	floor: PropTypes.number.isRequired,
	entities: PropTypes.array.isRequired,
	occupiedSquares: PropTypes.array.isRequired,
	lightsOn: PropTypes.bool.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	depth: PropTypes.number.isRequired,

};








