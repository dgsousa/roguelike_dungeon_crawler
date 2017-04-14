import React, {Component, PropTypes, createElement} from 'react';
import {connect} from "react-redux";
import * as WorldActionCreators from "../actions/world.jsx";
import World from "./scripts/world.js";


class App extends Component {		
	constructor(props) {
		super(props);
	}


	componentWillMount() {
		const {createWorld, world} = this.props;
		createWorld(world);
	}

	setUpBoard() {
		const {width, height, world, floor} = this.props;
		const map = world._regions[floor];
		const chars = {
			'0': 'wall',
			'1': 'floor',
			'2': 'floor',
			'3': 'floor',
			'5': 'stairs'
		};
		const rows = [];
		for(let y = 0; y < 15; y++) {
			let row = [];
			for(let x = 0; x < 25; x++) {
				row.push(createElement("div", {className: "tile " + chars[map[x][y]], key: x+"x"+y}, " "));
			}
			console.log()
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

const mapStateToProps = (state) => ({
	world: new World(state.width, state.height, state.depth),
	floor: state.floor
})


export default connect(
	mapStateToProps,
	{createWorld: WorldActionCreators.createWorld}
)(App);








