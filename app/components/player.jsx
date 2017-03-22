import React, {Component, PropTypes} from 'react';





export default class Player extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let style = {
			top: this.props.player.coords[1] * 30,
			left: this.props.player.coords[0] * 30
		}
		return (
			<div
				className={'player yoda'}
				style={style}>
			</div>
		)
	}
}