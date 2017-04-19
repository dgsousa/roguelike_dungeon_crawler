import React, { PropTypes} from "react";

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

export default Restart;

React.propTypes = {
	gameEnd: PropTypes.bool.isRequired,
	restart: PropTypes.func.isRequired
};

