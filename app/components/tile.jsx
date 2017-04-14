import React, {Component, PropTypes} from 'react';
import { connect } from "react-redux";


class Tile extends Component {	
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.char === nextProps.char) {
			return false;
		}
		return true;
	}
	
	render() {
		const {char, style} = this.props;
		return (
			<div 
				className={"tile " + char}
				style={style}>
			</div>
		)	
	}
}




const mapStateToProps = (state, ownProps) => ({
	style: {
			top: ownProps.y * 30,
			left: ownProps.x * 30
		},
	char: chars[ownProps.tile]
})

export default TileContainer = connect(mapStateToProps)(Tile);







