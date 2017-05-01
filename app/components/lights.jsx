import React, { PropTypes} from "react";
import { connect } from "react-redux";
import { switchLights } from "../actions/index.jsx";


const Lights = ({ lightsOn, switchLights }) => {

	return (
		<button 
			className="lights"
			onClick={ switchLights }>
			{lightsOn ? "Turn Lights Off" : "Turn Lights On"}
		</button>
	);
};

const mapStateToProps = (state) => ({
	lightsOn: state.lightsOn
});

export default connect(
	mapStateToProps,
	{ switchLights: switchLights }
)(Lights);

React.propTypes = {
	LightsOn: PropTypes.bool.isRequired,
	switchLights: PropTypes.func.isRequired
};