import React, {Component, /*createElement*/} from "react";
import {connect} from "react-redux";
import { scroll, setupFloor } from "../actions/index.jsx";
import Restart from "./restart.jsx";
import Stats from "./stats.jsx";
import Lights from "./lights.jsx";
import { getBoard } from "../selectors/index.jsx";


class Board extends Component {

	componentWillMount() {
		const { setupFloor } = this.props;
		setupFloor();
	}

	render() {
		const { scroll, board } = this.props;

		return (
			<div
				className="board"
				tabIndex={"0"}
				onKeyDown={scroll}>
				<Restart />			
				<Stats />
				<Lights />
				{ board }
			</div>
		);
	}
}


const mapStateToProps = (state) => ({
	board: getBoard(state)
});


export default connect(
	mapStateToProps, {	
		scroll: scroll,
		setupFloor: setupFloor
	}
)(Board);








