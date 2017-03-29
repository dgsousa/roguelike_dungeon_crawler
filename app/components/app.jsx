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
			visibleCells: {},
			exploredCells: {}
		}
	};
	
	componentWillMount() {
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		this.setState(this.createGame());
	};

	
	dig(x, y) {
		const map = this.state.map;
		map[x][y] = true;
		return map;
	}
	

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



	scroll(e) {
		e.preventDefault();
		console.log(e.keyCode);
		if(e.keyCode === ROT.VK_I) {
			this.scrollScreen(0, -1);
					
		} else if(e.keyCode === ROT.VK_M) {
			console.log('test');
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
		const exploredCells = this.state.exploredCells;
		let fov = this.state.fov;
		if(this.squareIsEmpty(playerX, playerY)) {
			// Be careful using object spread syntax here - it only copies enumerable methods(not _proto_)
			const player = this.state.player;
			player.coords = [playerX, playerY];
			fov.compute(playerX, playerY, 3, (fovX, fovY, radius, visibility) => {
				exploredCells[fovX + ',' + fovY + ',' + this.state.floor] = true;
			})	
			state = {
				player: player,
				coords: [screenX, screenY],
				message: '',
				exploredCells: exploredCells
			}
			if(this.state.map[playerX][playerY] == 2) {
				state.floor = this.state.floor + 1;
				fov.compute(playerX, playerY, 3, (fovX, fovY, radius, visiblitiy) => {
					exploredCells[fovX + ',' + fovY + ',' + state.floor] = true;
				})
				state.map = this.state.world.tiles[state.floor];
				state.message = 'Enter the next level, you have.';
				state.fov = this.state.world.fov[state.floor];
				state.entities = this.generateEntities(this.state.map, trooperTemplate, 5, [player]);
				state.exploredCells = exploredCells;
			}	
		} else if(entity) {
			state = {
				message: this.state.player.attack(entity),
				entities: entity._hp <= 0 ? this.removeEntity(entity) : this.state.entities,
				
			}
		} else {
			state = {
				map: this.dig(playerX, playerY),
				message: 'Do or do not. There is no try'
			}
		}
		this.engine.unlock();
		state = {...state, entities: state.entities || this.addMoreTroopers()}
		this.setState(state);
	}

	
	squareIsEmpty(x, y, entities = this.state.entities, map = this.state.map) {
		if  (map[x][y] && !this.entityAt(entities, [x, y])) {
			return true;
		}
		return false;
	}


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
				this.scheduler.add(newTrooper);
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


	entityAt(entities, coords) {
		if(!entities) return false;
		for(let i = 0; i < entities.length; i++) {
			if(entities[i].coords[0] == coords[0] && entities[i].coords[1] == coords[1]) {
				return entities[i];
			}
		}
		return false;
	}
	
	render() {
		return (
			<div>
				<div 
					className={'message'}>
					{this.state.message}
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