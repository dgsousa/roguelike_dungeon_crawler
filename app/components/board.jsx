import React, {Component, PropTypes} from 'react';
import Player from "./player.jsx";
import Tile from "./tile.jsx";
import EntityComponent from "./entity.jsx";


export default class Board extends Component {
	constructor(props) {
		super(props);
	}

	getTiles() {
		let chars = {
			'0': 'chewy',
			'1': '',
			'2': 'red'
		};

		let tiles = this.props.map.map((col, x) => {
			return col.map((tile, y) => {
				char = this.props.exploredCells[x + ',' + y + ',' + this.props.floor] ? chars[tile] : 'grey'
				
				let style = {
					top: y * 30,
					left: x * 30
				}
				return (
					<Tile 
						key = {y * this.props.width + x}
						style = {style}
						char = {char} />
				)
			})
		});
		return tiles;
	}


	getEntityComponents() {
		let entityComponents = this.props.entities.map((entity, i) => {
			let style = {
				top: entity.coords[1] * 30,
				left: entity.coords[0] * 30,
				display: this.props.exploredCells[entity.coords[0] + ',' + entity.coords[1] + ',' + this.props.floor] ? 'block' : 'none'
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
