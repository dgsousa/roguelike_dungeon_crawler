import React, {Component, PropTypes} from 'react';


export default class EntityComponent extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div
				className={"entity trooper"}
				style={this.props.style}>
				
			</div>
		)
	}
}