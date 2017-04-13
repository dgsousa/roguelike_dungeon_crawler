import React, {Component, PropTypes} from 'react';
import { connect } from "react-redux";
import WorldActionCreators from "../actions/world.jsx";
//import Tile from "./tile.jsx";



class Board extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.map);
		return (
			<div 
				className={"board"}>
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	map: state.world._regions[state.floor]
})


export default BoardContainer = connect(mapStateToProps)(Board);







