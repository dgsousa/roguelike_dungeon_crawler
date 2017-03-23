import React, {Component, PropTypes} from 'react';
import Player from "./player.jsx";
import Tile from "./tile.jsx";
import Entity from "./entity.jsx";


export default class Board extends Component {
	constructor(props) {
		super(props);
	}

	getTiles() {
		let tiles = this.props.map.map((tile, i)=> {
			let char = tile ? '' : 'chewy'
			let style = {
				top: Math.floor(i/this.props.width) * 30,
				left: (i % this.props.width) * 30
			}
			return (<Tile key={i} style={style} char={char}/>) 	
		})
		return tiles;
	}


	getEntities() {
		let entities = this.props.entities.map((entity, i) => {
			let style = {
				top: entity.coords[1] * 30,
				left: entity.coords[0] * 30
			}
			return (<Entity key={i} style={style}/>)
		})
		return entities;
	}


	render() {
		let tiles = this.getTiles();
		let entities = this.getEntities();
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
				{entities}
				{tiles}
				
			</div>
		)
	}
}
