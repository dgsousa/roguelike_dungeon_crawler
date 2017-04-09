import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';
import Message from './message.jsx';
import Stats from './stats.jsx';
import Entity from "./scripts/entity.js";
import {Item, foodTemplate, weaponTemplate} from "./scripts/item.js";
import { playerTemplate, enemyTemplate, bossTemplate } from "./scripts/entities.js";
import World from "./scripts/world.js";
import * as Sprint from "sprintf-js";



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {},
			entities: [],
			items: [],
			coords: [],
			floor: 0,
			fov: null,
			exploredCells: {},
			message: []
		}
	};
	
	componentWillMount() {
		this.setState(this.createGame());
	};


	createGame() {
		const world = new World(this.props.width, this.props.height, this.props.depth);
		const map = world.regions[this.state.floor];
		const fov = world.fov[this.state.floor];
		const exploredCells = {};
		const player = this.generateEntity(playerTemplate, map);
		const enemies = this.generateEntities(enemyTemplate(this.state.floor + 1), 10, map, player);
		const weapons = this.generateItems(weaponTemplate(this.state.floor + 1), 1, map, player);
		const food = this.generateItems(foodTemplate(this.state.floor + 1), 5, map, player);
		fov.compute(player.coords[0], player.coords[1], 3, (fovX, fovY, radius, visibility) => {
			exploredCells[fovX + ',' + fovY + ',' + this.state.floor] = true;
		})
		return {
			world: world,
			map: map,
			player: player,
			entities: [...enemies],
			items: [...weapons, ...food],
			coords: [
				Math.max(0, Math.min(player.coords[0] - 12, this.props.width - 25)), 
				Math.max(0, Math.min(player.coords[1] - 7, this.props.height - 15))
			],
			fov: fov,
			exploredCells: exploredCells,
			message: [`Welcome to the Dungeon!`]
		}
	};

	//Navigation functions

	scroll(e) {
		e.preventDefault();
		if(e.keyCode === ROT.VK_I) {
			this.scrollScreen(0, -1);
					
		} else if(e.keyCode === ROT.VK_M) {
			this.scrollScreen(0, 1);	
			
		} else if(e.keyCode === ROT.VK_J) {
			this.scrollScreen(-1, 0);
			
		} else if(e.keyCode === ROT.VK_K) {
			this.scrollScreen(1, 0);
		}
	};


	scrollScreen(x, y) {
		const playerX = Math.max(0, Math.min(this.props.width - 1, this.state.player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(this.props.height - 1, this.state.player.coords[1] + y));
		const screenX = Math.max(0, Math.min(playerX - 12, this.props.width - 25));
		const screenY = Math.max(0, Math.min(playerY - 7, this.props.height - 15));
		let state;
		if(this.isStaircase([playerX, playerY]) && this.squareIsEmpty([playerX, playerY])) {
			state = this.goUpstairs([playerX, playerY], [screenX, screenY]);
		} else if(this.squareIsEmpty([playerX, playerY])) {
			state = this.move([playerX, playerY], [screenX, screenY]);	
		} else if(entity = this.entityAt(this.state.entities, [playerX, playerY])) {
			state = this.attackEntity(entity);
		} 
		this.state.entities.forEach(function(entity) {
			entity.act();
		})
		this.setState(state || this.state);
		
	}

	goUpstairs(playerCoords, screenCoords) {
		const player = this.state.player;
		player.coords = playerCoords;
		const exploredCells = {};
		const floor = this.state.floor + 1;
		const map = this.state.world.regions[floor];
		const enemies = floor == 3 ? 
						[...this.generateEntities(enemyTemplate(floor + 1), 10, map, player), ...this.generateEntities(bossTemplate, 1, map, player)]:
						this.generateEntities(enemyTemplate(floor + 1), 10, map, player);
		const weapons = this.generateItems(weaponTemplate(floor + 1), 1, this.state.world.regions[floor], player);
		const food = this.generateItems(foodTemplate(floor + 1), 5, this.state.world.regions[floor], player);


		this.state.fov.compute(playerCoords[0], playerCoords[1], 3, (x, y, radius, visiblitiy) => {
			exploredCells[x + ',' + y + ',' + floor] = true;
		})
		return {
			map: map,
			player: player,
			entities: enemies,
			items: [...weapons, ...food],
			message: [`You are now on the floor number ${floor + 1}.`],
			coords: screenCoords,
			fov: this.state.world.fov[floor],
			exploredCells: exploredCells,
			floor: floor,
		}
	}

	move(playerCoords, screenCoords) {
		const player = this.state.player;
		player.coords = playerCoords;
		const exploredCells = this.state.exploredCells;
		const message = [];
		const items = this.pickUpItem(player, message);
		const entities = this.moveEntities(this.state.entities, player);

		this.state.fov.compute(playerCoords[0], playerCoords[1], 3, (x, y, radius, visibility) => {
			exploredCells[x + ',' + y + ',' + this.state.floor] = true;
		})	
		
		return {
			player: player,
			entities: entities,
			items: items,
			coords: screenCoords,
			message: message,
			exploredCells: exploredCells
		}
	}


	attackEntity(entity) {
		return {
			message: this.state.player.attack(entity),
			entities: entity._hp <= 0 ? this.removeEntity(entity) : this.state.entities,
		}
	}


	//functions for discerning what kind of square is being encountered

	isStaircase(coords, map = this.state.map) {
		return map[coords[0]][coords[1]] == 5
	}

		
	squareIsEmpty(coords, map = this.state.map, entities = this.state.entities, player = this.state.player) {
		if(coords[0] >= 0 && coords[0] < this.props.width && coords[1] >= 0 && coords[1] < this.props.height) {
			if(map[coords[0]][coords[1]] && !this.entityAt(entities, coords) && !this.playerAt(player, coords) && !this.isStaircase(coords, map)) {
				return true;
			} 
		}
		return false;
	}

	entityAt(entities, coords) {
		if(entities) {
			for(let i = 0; i < entities.length; i++) {
				if(entities[i].coords[0] == coords[0] && entities[i].coords[1] == coords[1]) {
					return entities[i];
				}
			}
		}
		return false;
	}

	

	playerAt(player, coords) {
		return player.coords && coords[0] == player.coords[0] && coords[1] == player.coords[1];
	}

	//functions for generating entities

	initialize(map = this.state.map, entities = this.state.entities, player = this.state.player) {
		let x, y;
		do {
			x = Math.floor(Math.random() * this.props.width);
			y = Math.floor(Math.random() * this.props.height);
		} while (!this.squareIsEmpty([x, y], map, entities,  player));
		return [x, y];
	}


	generateEntity(template, map) {
		let entity = new Entity(template);
		entity.coords = this.initialize(map);
		return entity;
	}


	generateEntities(template, num, map, player, floor=this.state.floor) {
		let entities = [];
		for(let i = 0; i < num; i++) {
			let entity = new Entity(template);
			entity.coords = this.initialize(map, entities, player);
			entities.push(entity);
		}
		return entities;
	}

	
	removeEntity(entity) {
		const entities = this.state.entities;
		for(let i = 0; i < entities.length; i++) {
			if(entities[i] == entity) {
				entities.splice(i, 1);
				break;
			}
		}
		return entities;
	}


	generateItems(template, num, map, player) {
		let items = [];
		for(let i = 0; i < num; i++) {
			let item = new Item(template);
			item.coords = this.initialize(map, [], player);
			items.push(item);
		}
		return items;
	}

	pickUpItem(player, message) {
		items = this.state.items;
		for(i = 0; i < items.length; i++) {
			if(items[i].coords[0] === player.coords[0] && items[i].coords[1] === player.coords[1]) {
				player._hp += items[i]._hp;
				player._attackValue += items[i]._attackValue;
				message.push([`You found a ${items[i].type}.`])
				items.splice(i, 1);
			}
		}
		return items;
	}


	moveEntities(entities, player) {
		for (let i = 0; i < entities.length; i++) {
			if(entities[i]._newCoords && 
				this.squareIsEmpty(entities[i]._newCoords, this.state.map, this.state.entities, player)) {
				entities[i].coords = entities[i]._newCoords;
			}
		}
		return entities;
	}
	
	render() {
		return (
			<div>
				<Message message={this.state.message}/>
				
				<div 
					className={'view'}
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>				
					
					<Board
						map={this.state.map}
						width={this.props.width}
						height={this.props.height}
						player={this.state.player}
						entities={this.state.entities}
						items={this.state.items}
						coords={this.state.coords}
						exploredCells={this.state.exploredCells}
						floor={this.state.floor}>
					</Board>
				</div>
				<Stats player={this.state.player}/>

			</div>
			
		)
	}
}