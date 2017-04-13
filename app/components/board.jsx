import React, {Component, PropTypes} from 'react';
import { connect } from "react-redux";
import WorldActionCreators from "../actions/world.jsx";
//import Tile from "./tile.jsx";



class Board extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {player, height, width} = this.props;
		const tiles = this.getTiles();
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
		const style = {
			top: -screenY * 30,
			left: -screenX * 30
		}
			
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







