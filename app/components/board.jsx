import React, {Component, PropTypes} from 'react';
import Player from "./player.jsx";
import Tile from "./tile.jsx";
import EntityComponent from "./entity.jsx";


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


	getEntityComponents() {
		let entityComponents = this.props.entities.map((entity, i) => {
			let style = {
				top: entity.coords[1] * 30,
				left: entity.coords[0] * 30
			}
			return (<EntityComponent key={i} style={style}/>)
		})
		return entityComponents;
	}


	render() {
		let tiles = this.getTiles();
		let entityComponents = this.getEntityComponents();
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
				{entityComponents}
				{tiles}
				
			</div>
		)
	}
}
