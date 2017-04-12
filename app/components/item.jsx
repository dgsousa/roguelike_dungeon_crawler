import React, {Component, PropTypes} from 'react';


export default class ItemComponent extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div
				className={"item " + this.props.type}
				style={this.props.style}>
				
			</div>
		)
	}
}