import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';
import Entity from "./scripts/entity.js";
import { playerTemplate, trooperTemplate } from "./scripts/entities.js";
import * as Sprint from "sprintf-js";



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {},
			entities: [],
			coords: [],
			message: ''
		}
	};
	
	componentWillMount() {
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		this.setState(this.createGame());
	};

	
	dig(x, y) {
		const map = this.state.map;
		const i = this.props.width * y + x;
		map[i] = true;
		return map;
	}
	

	createGame() {
		const map = [];
		let player;
		let stormTroopers;
		const area = this.props.width * this.props.height;
		for(let i = 0; i < area; i++) {
			map.push([]);
		}
		const generator = new ROT.Map.Cellular(this.props.width, this.props.height);
		generator.randomize(.52);
		for(let i = 0; i < 10 ; i++) {
			generator.create();
		}		
		generator.create((x,y,v) => {
			const i = y * this.props.width + x;
			v === 1 ? map[i] = true : map[i] = false;
		});

		player = this.generateEntity(map, playerTemplate);
		stormTroopers = this.generateEntities(map, trooperTemplate, 10, [player]);

		return {
			map: map,
			player: player,
			entities: [...stormTroopers],
			coords: [
				Math.max(0, Math.min(player.coords[0] - 12, this.props.width - 25)), 
				Math.max(0, Math.min(player.coords[1] - 7, this.props.height - 15))
			]
		}
	};



	scroll(e) {
		e.preventDefault();
		if(e.keyCode === ROT.VK_UP) {
			this.scrollScreen(0, -1);
					
		} else if(e.keyCode === ROT.VK_DOWN) {
			this.scrollScreen(0, 1);	
			
		} else if(e.keyCode === ROT.VK_LEFT) {
			this.scrollScreen(-1, 0);
			
		} else if(e.keyCode === ROT.VK_RIGHT) {
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
		if(this.squareIsEmpty(playerX, playerY)) {
			// Be careful using object spread syntax here - it only copies enumerable methods(not _proto_)
			const player = this.state.player;
			player.coords = [playerX, playerY]
			state = {
				player: player,
				coords: [screenX, screenY],
				message: ''
			}
		} else if(entity) {
			const message = this.state.player.attack(entity);
			state = {
				entities: entity._hp <= 0 ? this.removeEntity(entity) : this.state.entities,
				message: message
			}
		} else {
			state = {
				map: this.dig(playerX, playerY),
				message: ''
			}
		}
		this.engine.unlock();
		state = {...state, entities: state.entities || this.addMoreTroopers()}
		this.setState(state);
	}

	
	squareIsEmpty(x, y, entities = this.state.entities, map = this.state.map) {
		if  (map[(y * this.props.width) + x] && !this.entityAt(entities, [x, y])) {
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
						coords={this.state.coords}>
					</Board>
				</div>

			</div>
			
		)
	}
}