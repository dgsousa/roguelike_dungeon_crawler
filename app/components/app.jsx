import React, {Component, PropTypes} from 'react';
import {connect} from "react-redux";
import * as WorldActionCreators from "../actions/world.jsx";
import BoardContainer from './board.jsx';
import World from "./scripts/world.js";


class App extends Component {		
	constructor(props) {
		super(props);
	}


	componentWillMount() {
		const {createWorld, world} = this.props;
		createWorld(world);
	}

	render() {
		return (
			<div>
				<div className="message"></div>
				<div className="view">
					<BoardContainer />
				</div>
			</div>	
		)
	}
	
}

const mapStateToProps = (state) => ({
	world: new World(state.width, state.height, state.depth),
})


export default connect(
	mapStateToProps,
	{createWorld: WorldActionCreators.createWorld}
)(App);








