import React, {Component, PropTypes} from 'react';


export default class Entity extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		//console.log('test');
		return (
			<div
				className={"entity"}
				style={this.props.style}>
				
			</div>
		)
	}
}