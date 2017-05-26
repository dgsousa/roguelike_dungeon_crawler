import React, { PropTypes} from "react";
import { connect } from "react-redux";


const Stats = ({entities: [player]}) => (
	<div className="stats">
		<div><p>{player._name}</p></div>
		<div><p>Weapon: {player._weapon}</p></div>
		<div><p>Attack: {player._attackValue}</p></div>
		<div><p>HP: {player._hp}</p></div>
		<div><p>XP: {player._experience}</p></div>
		<div><p>Level: {player._level}</p></div>
	</div>
);

const mapStateToProps = (state) => ({
	entities: state.entities
});


export default connect(mapStateToProps)(Stats);


Stats.propTypes = {
	player: PropTypes.shape({
		_name: PropTypes.string.isRequired,
		_weapon: PropTypes.string.isRequired,
		_attackValue: PropTypes.number.isRequired,
		_hp: PropTypes.number.isRequired,
		_experience: PropTypes.number.isRequired,
		_level: PropTypes.number.isRequired
	}),
};