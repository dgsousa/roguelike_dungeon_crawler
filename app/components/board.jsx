import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import { scroll, setupFloor } from "../actions/index.jsx";
import { getBoard } from "../selectors/index.jsx";


class Board extends Component {

	componentWillMount() {
		this.props.setupFloor();
	}

	render() {
		const { scroll, board, children } = this.props;
		return (
			<div
				className="board"
				tabIndex={"0"}
				onKeyDown={scroll}>
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
		scroll: scroll,
		setupFloor: setupFloor
	}
)(Board);


Board.propTypes = {
	board: PropTypes.array.isRequired
};







