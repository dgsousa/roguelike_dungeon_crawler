import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import { scrollScreen, setupFloor } from "../actions/index.jsx";
import { getBoard } from "../selectors/index.jsx";


class Board extends Component {

	componentWillMount() {
		this.props.setupFloor();
	}

	render() {
		const { scrollScreen, board, children } = this.props;
		return (
			<div
				className="board"
				tabIndex={"0"}
				onKeyDown={scrollScreen}>
				{children}
				{board}
			</div>
		);
	}
}


const mapStateToProps = (state) => ({
	board: getBoard(state)
});


export default connect(
	mapStateToProps, {	
		scrollScreen: scrollScreen,
		setupFloor: setupFloor
	}
)(Board);


Board.propTypes = {
	board: PropTypes.array.isRequired
};







