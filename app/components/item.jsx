import React, {Component, PropTypes} from 'react';


export default class ItemComponent extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div
				className={"item saber"}
				style={this.props.style}>
				
			</div>
		)
	}
}