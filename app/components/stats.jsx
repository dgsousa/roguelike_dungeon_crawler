import React, {Component, PropTypes} from 'react';


export default class Stats extends Component {
	constructor(props) {
		super(props);
	}



	render() {
		return (
			<div className="stats">
				<div><p>{this.props.player._name}</p></div>
				<div><p>Weapon: {this.props.player._weapon}</p></div>
				<div><p>Attack: {this.props.player._attackValue}</p></div>
				<div><p>HP: {this.props.player._hp}</p></div>
				<div><p>XP: {this.props.player._experience}</p></div>
				<div><p>Level: {this.props.player._level}</p></div>
			</div>
		)
	}
}