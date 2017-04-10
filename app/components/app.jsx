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
			map: [],
			player: {},
			entities: [],
			items: [],
			coords: [],
			floor: 0,
			fov: null,
			exploredCells: {},
			message: [],
			gameEnd: false
		}
	};
	
	componentWillMount() {
		this.setState(this.createGame());
	};


	createGame() {
		const {width, height, depth} = this.props;
		const {floor} = this.state;
		const world = new World(width, height, depth);
		const map = world.regions[floor];
		const fov = world.fov[floor];
		const exploredCells = {};
		const player = this.generateEntity(playerTemplate, map);
		const enemies = this.generateEntities(enemyTemplate(floor + 1), 10, map, player);
		const weapons = this.generateItems(weaponTemplate(floor + 1), 1, map, player);
		const food = this.generateItems(foodTemplate(floor + 1), 5, map, player);
		fov.compute(player.coords[0], player.coords[1], 4, (fovX, fovY, radius, visibility) => {
			exploredCells[fovX + ',' + fovY + ',' + floor] = true;
		})
		return {
			world: world,
			map: map,
			player: player,
			entities: [...enemies],
			items: [...weapons, ...food],
			coords: [
				Math.max(0, Math.min(player.coords[0] - 12, width - 25)), 
				Math.max(0, Math.min(player.coords[1] - 7, height - 15))
			],
			fov: fov,
			exploredCells: exploredCells,
			message: [`Welcome to the Dungeon!`]
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
		const screenX = Math.max(0, Math.min(playerX - 12, width - 25));
		const screenY = Math.max(0, Math.min(playerY - 7, height - 15));
		return {
			playerCoords: [playerX, playerY],
			screenCoords: [screenX, screenY]
		}
	}


	scrollScreen(x, y) {
		const {playerCoords, screenCoords} = this.updateCoords(x, y);
		
		const state = 	this.goUpstairs(playerCoords, screenCoords) || 
						this.move(playerCoords, screenCoords) 		||
						this.attackEntity(playerCoords)				||
						this.state;
		
		state.entities.forEach((entity) => {
			entity.act();
		});
		this.setState(state);
	}

	goUpstairs(playerCoords, screenCoords) {
		if(this.isStaircase(playerCoords) && this.squareIsEmpty(playerCoords)) {
			const {player, fov, world} = this.state;
			player.coords = playerCoords;
			const exploredCells = {};
			const floor = this.state.floor + 1;
			const map = world.regions[floor];
			const enemies = this.generateEntities(enemyTemplate(floor + 1), 10, map, player);
			const boss = this.generateEntities(bossTemplate, 1, map, player)
			const entities = floor == 3 ? [...enemies, ...boss]: [...enemies];				
			const weapons = this.generateItems(weaponTemplate(floor + 1), 1, world.regions[floor], player);
			const food = this.generateItems(foodTemplate(floor + 1), 5, world.regions[floor], player);

			fov.compute(playerCoords[0], playerCoords[1], 3, (x, y, radius, visiblitiy) => {
				exploredCells[x + ',' + y + ',' + floor] = true;
			})
			return {
				map: map,
				player: player,
				entities: entities,
				items: [...weapons, ...food],
				message: [`You are now on the floor number ${floor + 1}.`],
				coords: screenCoords,
				fov: world.fov[floor],
				exploredCells: exploredCells,
				floor: floor,
			}
		} 
		return false;
	}

	move(playerCoords, screenCoords) {
		if(this.squareIsEmpty(playerCoords)) {
			const {player, fov, floor} = this.state;
			player.coords = playerCoords;
			const exploredCells = {}//this.state.exploredCells;
			const message = [];
			const items = this.pickUpItem(player, message);
			const entities = this.moveEntities(this.state.entities, player);
			fov.compute(playerCoords[0], playerCoords[1], 4, (x, y, radius, visibility) => {
				exploredCells[x + ',' + y + ',' + floor] = true;
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
		return false;
	}


	attackEntity(playerCoords) {
		const {player, entities} = this.state;
		if(entity = this.entityAt(entities, playerCoords)) {
			player.attack(entity);
			const gameEnd = this.checkGameStatus(player);
			return {
				message: player._message,
				entities: entity._hp <= 0 ? this.removeEntity(entity) : entities,
				gameEnd: gameEnd
			}
		}
		return false;
	}


	//functions for discerning what kind of square is being encountered

	isStaircase(coords, map = this.state.map) {
		return map[coords[0]][coords[1]] == 5
	}

		
	squareIsEmpty(coords, map = this.state.map, entities = this.state.entities, player = this.state.player) {
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
		const {items} = this.state;
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

	checkGameStatus(player) {
		return 	player._hp <= 0 ? "You Lose!" : 
				player._experience > 1000 ? "You Win!" : false
	}

	restart() {
		this.setState({...this.createGame(), gameEnd: false});
	}
	
	render() {
		const {width, height} = this.props;
		const {message, gameEnd, map, player, entities, items, coords, exploredCells, floor} = this.state;
		return (
			<div>
				<Message message={message}/>
				
				<div 
					className={'view'}
					tabIndex={"0"}
					onKeyDown={this.scroll.bind(this)}>	

					<Restart 
						gameEnd={gameEnd}
						restart={this.restart.bind(this)}/>			
					
					<Board
						map={map}
						width={width}
						height={height}
						player={player}
						entities={entities}
						items={items}
						coords={coords}
						exploredCells={exploredCells}
						floor={floor}>
					</Board>
				</div>
				<Stats player={player}/>

			</div>
			
		)
	}
}