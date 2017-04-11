import React, {Component, PropTypes} from 'react';


export default class Stats extends Component {
	constructor(props) {
		super(props);
	}



	render() {
		return (
			<div className="stats">
				<div><p>{this.props.player._name}</p></div><br/>
				<div><p>Attack: {this.props.player._attackValue}</p></div><br/>
				<div><p>HP: {this.props.player._hp}</p></div><br/>
				<div><p>XP: {this.props.player._experience}</p></div><br/>
				<div><p>Level: {this.props.player._level}</p></div>
			</div>
		)
	}
}