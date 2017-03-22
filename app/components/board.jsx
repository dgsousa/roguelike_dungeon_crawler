import React, {Component, PropTypes} from 'react';
import Player from "./player.jsx";
import Tile from "./tile.jsx";


export default class Board extends Component {
	constructor(props) {
		super(props);
	}

	getTiles() {
		let width = this.props.width;
		let tiles = this.props.map.map((tile, i)=> {
			let color = tile ? 'black' : 'goldenrod';
			let char = tile ? '' : 'chewy'
			let style = {
				top: Math.floor(i/width) * 30,
				left: (i % width) * 30,
				color: color
			}
			return (<Tile key={i} style={style} char={char}/>) 	
		})
		return tiles;
	}


	render() {
		let tiles = this.getTiles();
		let style = {
			top: -this.props.coords[1] * 30,
			left: -this.props.coords[0] * 30
		}
			
		return (
			<div 
				className={"board"}
				style={style}>
				<Player 
					player={this.props.player}/>
				{tiles}
			</div>
		)
	}
}
