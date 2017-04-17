import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';
import Message from './message.jsx';
import Stats from './stats.jsx';
import Restart from "./restart.jsx";
import Entity from "./scripts/entity.js";
import {Item, foodTemplate, weaponTemplate} from "./scripts/item.js";
import { playerTemplate, enemyTemplate, bossTemplate } from "./scripts/entities.js";
import World from "./scripts/world.js";
import * as Sprint from "sprintf-js";



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			world: [],
			player: {},
			entities: [],
			items: [],
			floor: 0,
			message: "",
			gameEnd: false,
			lightsOn: false
		}
	};
	
	componentWillMount() {
		this.setState(this.createGame());
	};


	createGame() {
		const {width, height, depth} = this.props;
		const world = new World(width, height, depth);
		const map = world._regions[0];
		const player = this.generateEntity(playerTemplate, map);
		const enemies = this.generateEntities(enemyTemplate(1), 10, map, player);
		const weapons = this.generateItems(weaponTemplate(1), 1, map, player);
		const food = this.generateItems(foodTemplate(1), 5, map, player);
		
		return {
			world: world,
			player: player,
			entities: [...enemies],
			items: [...weapons, ...food],
			floor: 0,
			message: [`Welcome to the Dungeon!`],
			gameEnd: false
		}
	};

	//Navigation functions

	scroll(e) {
		e.preventDefault();
		e.keyCode === ROT.VK_I ? this.scrollScreen(0, -1) :
		e.keyCode === ROT.VK_M ? this.scrollScreen(0, 1) :
		e.keyCode === ROT.VK_J ? this.scrollScreen(-1, 0) :
		e.keyCode === ROT.VK_K ? this.scrollScreen(1, 0) : false
	};

	updateCoords(x, y) {
		const {width, height} = this.props;
		const {player} = this.state;
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		return {
			playerCoords: [playerX, playerY]
		}
	}

	scrollScreen(x, y) {
		const {playerCoords} = this.updateCoords(x, y);
		const {world, floor} = this.state;
		const map = world._regions[floor];
		
		const state = 	this.goUpstairs(playerCoords, map) 		|| 
						this.move(playerCoords, map) 			||
						this.attackEntity(playerCoords, map)	||
						this.state;				
		
		
		this.setState(state);
		
	}


	goUpstairs(playerCoords, map) {
		if(this.isStaircase(playerCoords, map) && this.squareIsEmpty(playerCoords, map)) {
			const {world} = this.state;
			const player = Object.assign(new Entity(), this.state.player, {coords: playerCoords});
			const floor = this.state.floor + 1;
			const map = world.regions[floor];
			const enemies = this.generateEntities(enemyTemplate(floor + 1), 10, map, player);
			const boss = this.generateEntities(bossTemplate, 1, map, player)
			const entities = floor == 3 ? [...enemies, ...boss]: [...enemies];				
			const weapons = this.generateItems(weaponTemplate(floor + 1), 1, world.regions[floor], player);
			const food = this.generateItems(foodTemplate(floor + 1), 5, world.regions[floor], player);

			return {
				player: player,
				entities: entities,
				items: [...weapons, ...food],
				message: [`You are now on floor number ${floor + 1}.`],
				floor: floor,
			}
		} 
		return false;
	}

	move(playerCoords, map) {
		if(this.squareIsEmpty(playerCoords, map)) {
			const {floor} = this.state;
			const player = Object.assign(new Entity(), this.state.player, {coords: playerCoords});
			const entities = this.moveEntities(this.copyEntities(this.state.entities), player);
			const {items, message} = this.pickUpItem(player);		
					
			return {
				player: player, 
				entities: entities,
				items: items,
				message: message
			}
		}
		return false;
	}


	attackEntity(playerCoords) {
		const player = this.copyEntity(this.state.player); 
		const entities = this.copyEntities(this.state.entities);
		if(entity = this.entityAt(entities, playerCoords)) {
			player.attack(entity); 
			const gameEnd = this.checkGameStatus(player);
			
			return {
				player: player,
				message: player._message,
				entities: entity._hp <= 0 ? this.removeEntity(entity, entities) : entities,
				gameEnd: gameEnd
			}
		}
		return false;
	}


	//functions for discerning what kind of square is being encountered

	isStaircase(coords, map) {
		return map[coords[0]][coords[1]] == 5
	}
	
	squareIsEmpty(coords, map, entities = this.state.entities, player = this.state.player) {
		const {width, height} = this.props;
		if(coords[0] >= 0 && coords[0] < width && coords[1] >= 0 && coords[1] < height) {
			if(map[coords[0]][coords[1]] && !this.entityAt(entities, coords) && !this.playerAt(player, coords)) {
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

	initialize(map = this.state.world[this.state.floor], entities = this.state.entities, player = this.state.player) {
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


	generateEntities(template, num, map, player) {
		let entities = [];
		for(let i = 0; i < num; i++) {
			let entity = new Entity(template);
			entity.coords = this.initialize(map, entities, player);
			entities.push(entity);
		}
		return entities;
	}

	
	removeEntity(entity, entities) { 
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

	pickUpItem(player) {
		const items = this.copyItems(this.state.items);
		const message = [];
		for(i = 0; i < items.length; i++) {
			if(items[i].coords[0] === player.coords[0] && items[i].coords[1] === player.coords[1]) {
				player._hp += items[i]._hp || 0;
				player._weapon = items[i].weapon || player._weapon;
				player._attackValue += items[i]._attackValue || 0;
				message.push([`You found a ${items[i].type}.`])
				items.splice(i, 1);
			}
		}
		return {items, message};
	}


	moveEntities(entities, player) {
		const {world, floor} = this.state;
		entities.forEach((entity) => {
			entity.act();
		})
		for (let i = 0; i < entities.length; i++) {
			if(entities[i]._newCoords && 
				this.squareIsEmpty(entities[i]._newCoords, world._regions[floor], entities, player)) {
				entities[i].coords = entities[i]._newCoords;
			}
		}
		return entities;
	}

	copyEntity(entity) {
		return Object.assign(new Entity(), entity);
	}

	copyEntities(entities) {
		return entities.map((entity) => {
			return Object.assign(new Entity(), entity);
		})
	}

	copyItems(items) {
		return items.map((item) => {
			return Object.assign(new Item(), item);
		});
	}

	checkGameStatus(player) {
		return 	player._hp <= 0 ? "You Lose!" : 
				player._experience > 1000 ? "You Win!" : false
	}


	getVisibleCells(playerCoords, floor, world) {
		const visibleCells = {};
		world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y, radius, visiblitiy) => {
			visibleCells[x + ',' + y + ',' + floor] = true;
		})
		return visibleCells;
	}

	switchLights() {
		const lightsOn = !this.state.lightsOn;
		this.setState({
			lightsOn: lightsOn
		})
	}
	
	render() {
		const {width, height} = this.props;
		const {message, gameEnd, player, entities, items, coords, floor, world, lightsOn} = this.state;
		const visibleCells = this.getVisibleCells(player.coords, floor, world);
		const map = world._regions[floor];
		return (
			<div>
				
				<Message message={message}/>
				
				<div 
					className={'view'}
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>	

					<Restart 
						gameEnd={gameEnd}
						restart={this.componentWillMount.bind(this)}/>			
					<Stats player={player}/>
					<button className="lights"
						onClick={this.switchLights.bind(this)}>
						{(lightsOn ? `Lights Off` : `Lights On`)}
					</button>
					<Board
						map={map}
						visibleCells={visibleCells}
						width={width}
						height={height}
						player={player}
						entities={entities}
						items={items}
						lightsOn = {lightsOn}
						
						floor={floor}>
					</Board>
				</div>
				

			</div>
			
		)
	}
}


