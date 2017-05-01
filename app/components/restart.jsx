import React, { PropTypes} from "react";
import { connect } from "react-redux";
import { restart } from "../actions/index.jsx";

const Restart = ({gameEnd, restart}) => {

	return (
		<div
			className="restart"
			style={{display: gameEnd ? "block" : "none"}}
			>
			<h1>{gameEnd}</h1>
			<button onClick={restart}>Play Again?</button>

		</div>
	);
};


const mapStateToProps = (state) => ({
	gameEnd: state.gameEnd
});

export default connect(
	mapStateToProps,
	{restart: restart}
)(Restart);

React.propTypes = {
	gameEnd: PropTypes.string.isRequired,
	restart: PropTypes.func.isRequired
};

