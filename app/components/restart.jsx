import React, {Component, PropTypes} from 'react';

export default class Restart extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		
		const display = this.props.gameEnd ? "block" : "none";

		return (
			<div
				className="restart"
				style={{display: display}}>
				<h1>{this.props.gameEnd}</h1>
				<button onClick={this.props.restart}>Play Again?</button>
			</div>
		)
	}
}