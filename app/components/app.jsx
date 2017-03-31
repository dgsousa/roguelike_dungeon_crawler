import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';
import Entity from "./scripts/entity.js";
import { playerTemplate, trooperTemplate } from "./scripts/entities.js";
import World from "./scripts/world.js";
import * as Sprint from "sprintf-js";



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {},
			entities: [],
			coords: [],
			message: '',
			floor: 0,
			fov: null,
			exploredCells: {}
		}
	};
	
	componentWillMount() {
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		this.setState(this.createGame());
	};

	
	createGame() {
		const world = new World(this.props.width, this.props.height, this.props.depth);
		const map = world.tiles[this.state.floor];
		const fov = world.fov[this.state.floor];
		const exploredCells = {};
		const player = this.generateEntity(map, playerTemplate);
		const stormTroopers = this.generateEntities(map, trooperTemplate, 15, [player]);
		fov.compute(player.coords[0], player.coords[1], 3, (fovX, fovY, radius, visibility) => {
			exploredCells[fovX + ',' + fovY + ',' + this.state.floor] = true;
		})

		return {
			world: world,
			map: map,
			player: player,
			entities: [...stormTroopers],
			coords: [
				Math.max(0, Math.min(player.coords[0] - 12, this.props.width - 25)), 
				Math.max(0, Math.min(player.coords[1] - 7, this.props.height - 15))
			],
			fov: fov,
			exploredCells: exploredCells
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
		const entity = this.entityAt(this.state.entities, [playerX, playerY]);
		let state;
		if(this.isStaircase(playerX, playerY) && this.squareIsEmpty(playerX, playerY)) {
			state = this.goUpstairs(playerX, playerY, screenX, screenY);
		} else if(this.squareIsEmpty(playerX, playerY)) {
			state = this.move(playerX, playerY, screenX, screenY);	
		} else if(entity) {
			state = this.encounterEntity(entity);
		} else {
			state = this.dig(playerX, playerY);
		}
		this.engine.unlock();
		state = {...state, entities: state.entities || this.addMoreTroopers()}
		this.setState(state);
	}

	goUpstairs(x, y, screenX, screenY) {
		const player = this.state.player;
		const exploredCells = {};
		const floor = this.state.floor + 1;
		player.coords = [x, y];
		this.state.fov.compute(x, y, 3, (x, y, radius, visiblitiy) => {
			exploredCells[x + ',' + y + ',' + floor] = true;
		})
		this.state.entities.forEach((entity) => {
			this.scheduler.remove(entity);
		})
		return {
			map: this.state.world.tiles[floor],
			player: player,
			entities: this.generateEntities(this.state.map, trooperTemplate, 15, [this.state.player]),
			message: 'Enter the next level, you have.',
			coords: [screenX, screenY],
			fov: this.state.world.fov[floor],
			exploredCells: exploredCells,
			floor: floor,
		}
	}

	move(x, y, screenX, screenY) {
		const player = this.state.player;
		const exploredCells = this.state.exploredCells;
		const entities = this.state.entities;
		player.coords = [x, y];
		this.state.fov.compute(x, y, 3, (x, y, radius, visibility) => {
			exploredCells[x + ',' + y + ',' + this.state.floor] = true;
		})	
		this.moveTroopers(this.state.entities, x, y);
		return {
			player: player,
			coords: [screenX, screenY],
			message: '',
			exploredCells: exploredCells
		}
	}

	dig(x, y) {
		const map = this.state.map;
		map[x][y] = true;
		return {
			map: map,
			message: 'Do or do not. There is no try'
		};
	}

	encounterEntity(entity) {
		return {
			message: this.state.player.attack(entity),
			entities: entity._hp <= 0 ? this.removeEntity(entity) : this.state.entities,
		}
	}


	//functions for discerning what kind of square is being encountered

	isStaircase(x, y) {
		return this.state.map[x][y] == 2
	}

		
	squareIsEmpty(x, y, entities = this.state.entities, map = this.state.map) {
		if(x >= 0 && x < this.props.width && y >= 0 && y < this.props.height) {
			if  (map[x][y] && !this.entityAt(entities, [x, y])) {
				return true;
			} 
		}
		return false;
	}

	entityAt(entities, coords) {
		if(!entities) return false;
		for(let i = 0; i < entities.length; i++) {
			if(entities[i].coords[0] == coords[0] && entities[i].coords[1] == coords[1]) {
				return entities[i];
			}
		}
		return false;
	}

	playerAt(coords, playerCoords = this.state.player.coords) {
		return coords[0] == playerCoords[0] && coords[1] == playerCoords[1];
	}

	//functions for generating entities

	initializeEntity(entities, map) {
		let x, y;
		do {
			x = Math.floor(Math.random() * this.props.width);
			y = Math.floor(Math.random() * this.props.height);
		} while (!this.squareIsEmpty(x, y, entities, map));
		return [x: x, y: y];
	}


	generateEntities(map, template, num, existingEntities) {
		let entities = [...existingEntities] || [];
		for(let i = 0; i < num; i++) {
			let entity = new Entity(template);
			entity.coords = this.initializeEntity(entities, map);
			entities.push(entity);
			this.scheduler.add(entity, true);
		}
		return existingEntities ? entities.splice(existingEntities.length) : entities;
	}


	addMoreTroopers() {
		let newTroopers = [];
		for(let i = 0; i < this.state.entities.length; i++) {
			let newTrooperCoords = this.state.entities[i]._newTrooperCoords;
			if(newTrooperCoords && this.squareIsEmpty(newTrooperCoords[0], newTrooperCoords[1])) {
				let newTrooper = new Entity(trooperTemplate)
				newTrooper.coords = newTrooperCoords;
				this.scheduler.add(newTrooper, true);
				newTroopers.push(newTrooper);
			}
		}
		return [...this.state.entities, ...newTroopers]
	}


	removeEntity(entity) {
		const entities = this.state.entities;
		this.scheduler.remove(entity);
		for(let i = 0; i < entities.length; i++) {
			if(entities[i] == entity) {
				entities.splice(i, 1);
				break;
			}
		}
		return entities;
	}


	generateEntity(map, template) {
		let entity = new Entity(template);
		entity.coords = this.initializeEntity([], map);
		entity.engine = this.engine;
		this.scheduler.add(entity, true);
		return entity;
	}

	moveTroopers(entities, x, y) {
		const troopers = entities;
		for (let i = 0; i < troopers.length; i++) {
			if(troopers[i]._newCoords && 
				!this.playerAt(troopers[i]._newCoords, [x, y]) &&
				this.squareIsEmpty(troopers[i]._newCoords[0], troopers[i]._newCoords[1])) {
				troopers[i].x = troopers[i]._newCoords[0];
				troopers[i].y = troopers[i]._newCoords[1];
			}
		}
		return troopers;
	}

	
	render() {
		return (
			<div>
				<div 
					className={'message'}><h4>
					{this.state.message}</h4>
				</div>
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
						coords={this.state.coords}
						exploredCells={this.state.exploredCells}
						floor={this.state.floor}>
					</Board>
				</div>

			</div>
			
		)
	}
}