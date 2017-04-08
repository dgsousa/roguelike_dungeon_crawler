import React, {Component, PropTypes} from 'react';


export default class Stats extends Component {
	constructor(props) {
		super(props);
	}



	render() {
		return (
			<div className="stats">
				<span>{this.props.player._name}</span>
				<span>Attack: {this.props.player._attackValue}</span>
				<span>HP: {this.props.player._hp}</span>
				<span>XP: {this.props.player._experience}</span>
				<span>Level: {this.props.player._level}</span>
			</div>
		)
	}
}