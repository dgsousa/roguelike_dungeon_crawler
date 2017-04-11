import React, {Component, PropTypes} from 'react';
import Player from "./player.jsx";
import Tile from "./tile.jsx";
import EntityComponent from "./entity.jsx";
import ItemComponent from "./item.jsx";

export default class Board extends Component {
	constructor(props) {
		super(props);
	}

	getTiles() {
		const chars = {
			'0': 'wall',
			'1': 'floor',
			'2': 'floor',
			'3': 'floor',
			'5': 'stairs'
		};

		const tiles = this.props.map.map((col, x) => {
			return col.map((tile, y) => {
				char = this.props.visibleCells[x + ',' + y + ',' + this.props.floor] ? chars[tile] : 'grey'
				//char = chars[tile];
				const style = {
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
		const entityComponents = this.props.entities.map((entity, i) => {
			const type = entity._type;
			const style = {
				top: entity.coords[1] * 30,
				left: entity.coords[0] * 30,
				display: this.props.visibleCells[entity.coords[0] + ',' + entity.coords[1] + ',' + this.props.floor] ? 'block' : 'none'
			}
			return (<EntityComponent key={i} style={style} type={type}/>)
		})
		return entityComponents;
	}

	getItemComponents() {
		const itemComponents = this.props.items.map((item, i) => {
			const style = {
				top: item.coords[1] * 30,
				left: item.coords[0] * 30,
				display: this.props.visibleCells[item.coords[0] + ',' + item.coords[1] + ',' + this.props.floor] ? 'block' : 'none'
			}
			return (<ItemComponent key={i} style={style}/>)
		})

		return itemComponents;
	}


	render() {
		const {player, height, width} = this.props;
		const tiles = this.getTiles();
		const entityComponents = this.getEntityComponents();
		const itemComponents = this.getItemComponents();
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
		const style = {
			top: -screenY * 30,
			left: -screenX * 30
		}
			
		return (
			<div 
				className={"board"}
				style={style}>
				<Player 
					player={player}/>
				{entityComponents}
				{itemComponents}
				{tiles}
				
			</div>
		)
	}
}
