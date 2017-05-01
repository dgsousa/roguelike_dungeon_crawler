import React, {Component, /*createElement*/} from "react";
import {connect} from "react-redux";
import { scroll, setupFloor } from "../actions/index.jsx";
import Restart from "./restart.jsx";
import Stats from "./stats.jsx";
import Lights from "./lights.jsx";
import Row from "./row.jsx";


class Board extends Component {

	componentWillMount() {
		const { setupFloor } = this.props;
		setupFloor();
	}

	// setUpBoard() {
	// 	const { width, height, player } = this.props;
	// 	const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
	// 	const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
	// 	const rows = [];
	// 	for(let y = screenY; y < screenY + 15; y++) {
	// 		let row = [];
	// 		for(let x = screenX; x < screenX + 25; x++) {
	// 			const tileClass = this.getTileClass(x, y);
	// 			row.push(createElement("div", {	
	// 				className: "tile " + tileClass, 
	// 				key: x+"x"+y, 
	// 				style: {left: 30 * (x - screenX)}}, " "));
	// 		}
	// 		rows.push(createElement("div", {
	// 			className: "row", 
	// 			key: y
	// 		}, row));
	// 	}
	// 	return rows;
	// }


	// getVisibleCells(playerCoords) {
	// 	const {world, floor} = this.props;
	// 	const visibleCells = {};
	// 	world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y) => {
	// 		visibleCells[`${x},${y},${floor}`] = true;
	// 	});
	// 	return visibleCells;
	// }

	// getTileClass(x, y) {
	// 	const {world, floor, player, occupiedSquares, lightsOn } = this.props;
	// 	const map = world._regions[floor];
	// 	const visibleCells = this.getVisibleCells(player.coords);
	// 	const chars = {
	// 		"0": "wall",
	// 		"1": "floor",
	// 		"2": "floor",
	// 		"3": "floor",
	// 		"5": "stairs",
	// 		"6": "grey"
	// 	};
	// 	return 	visibleCells[`${x},${y},${floor}`] || lightsOn ?
	// 				occupiedSquares[`${x}x${y}`] || chars[map[x][y]] :
	// 				chars["6"];			
	// }


	render() {
		// const { scroll } = this.props;
		// const rows = this.setUpBoard();

		const { screenY } = this.props;
		const rows = [];
		for(let y = screenY; y < screenY + 15; y++) {
			rows.push(<Row key={y} y={y}></Row>);
		}

		return (
			<div
				className="board"
				tabIndex={"0"}
				onKeyDown={scroll}>
				<Restart />			
				<Stats />
				<Lights />
				{ rows }
			</div>
		);
	}
}



const mapStateToProps = (state) => ({
	screenY: Math.max(0, Math.min(state.entities[0].coords[1] - 7, state.height - 15))
});


export default connect(
	mapStateToProps, {	
		scroll: scroll,
		setupFloor: setupFloor
	}
)(Board);








