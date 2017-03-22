import React, {Component, PropTypes} from 'react';



export default class Tile extends Component {	
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.style.top === nextProps.style.top && this.props.style.left === nextProps.style.left && this.props.style.color === nextProps.style.color) {
			return false;
		}
		return true;
	}
	
	render() {
		return (
			<div 
				className={"tile " + this.props.char}
				style={this.props.style}>
			</div>
		)	
	}
}