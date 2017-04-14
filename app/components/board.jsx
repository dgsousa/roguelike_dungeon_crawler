import React, {Component, PropTypes} from 'react';
import { connect } from "react-redux";
import WorldActionCreators from "../actions/world.jsx";
import TileContainer from "./tile.jsx";



class Board extends Component {
	constructor(props) {
		super(props);
	}


	render() {
		const {height, width, map} = this.props;
		
		const screenX = Math.max(0, Math.min(0 - 12, width - 25));
		const screenY = Math.max(0, Math.min(0 - 7, height - 15));
		const style = {
			top: -screenY * 30,
			left: -screenX * 30
		}
			
		return (
			<div 
				className={"board"}
				style={style}>
				{map.map((col, x) => 
					col.map((tile, y) =>
						<TileContainer
							key = {y * width + x}
							x = {x} 
							y = {y}
							tile = {tile} />
						)
					)
				}
			</div>
		)
	}
}


const mapStateToProps = (state) => ({
	map: state.world._regions[state.floor],
	width: state.width,
	height: state.height
})


export default BoardContainer = connect(mapStateToProps)(Board);







