import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {},
			entities: [],
			coords: []
		}
	};
	
	componentWillMount() {
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		this.createMap();
	};

	
	dig(x, y) {
		const map = this.state.map;
		const i = this.props.width * y + x;
		map[i] = true;
		this.setState({
			map: map
		})
	}
	

	createMap() {
		const map = [];
		let player;
		let entities;
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

		player = this.generatePlayer(map);
		entities = this.generateEntities(map);

		this.setState({
			map: map,
			player: player,
			entities: entities,
			coords: [
				Math.max(0, Math.min(player.coords[0] - 12, this.props.width - 25)), 
				Math.max(0, Math.min(player.coords[1] - 7, this.props.height - 15))
			]
		})
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
		this.engine.unlock();
	};


	scrollScreen(x, y) {	
		const playerX = Math.max(0, Math.min(this.props.width - 1, this.state.player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(this.props.height - 1, this.state.player.coords[1] + y));
		const screenX = Math.max(0, Math.min(playerX - 12, this.props.width - 25));
		const screenY = Math.max(0, Math.min(playerY - 7, this.props.height - 15));
		if(this.squareIsEmpty(playerX, playerY)) {
			const coords = [screenX, screenY];
			this.setState({
				coords: coords,
				player: {
					...this.state.player,
					coords: [playerX, playerY]
				}
			})
		} else if(this.entityAt(this.state.entities, [playerX, playerY])) {
			this.attack(this.entityAt(this.state.entities, [playerX, playerY]))
		} else {
			this.dig(playerX, playerY);
		}
	}

	squareIsEmpty(x, y) {
		if(this.state.map[(y * this.props.width) + x] && !this.entityAt(this.state.entities, [x, y])) {
			return true;
		}
		return false;
	}


	initializeEntity(map) {
		let x, y;
		do {
			x = Math.floor(Math.random() * this.props.width);
			y = Math.floor(Math.random() * this.props.height);
		} while (!map[y * this.props.width + x]);
		return [x: x, y: y];
	}

	generateEntities(map) {
		let entities = [];
		do {
			let entity = {}
			entity["coords"] = this.initializeEntity(map);
			entity["act"] = function() {};
			if(!this.entityAt(entities, entity.coords)) {
				entities.push(entity);
				this.scheduler.add(entity, true);
			}	
		} while (entities.length < 20)
		return entities;
	}

	addEntity(entity) {
		const entities = this.state.entities;
		this.scheduler.add(entity);
		entities.push(entity);
		this.setState({entities: entities});

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
		this.setState({entities: entities});
	}


	generatePlayer(map) {
		let player = {
			coords: this.initializeEntity(map),
			act: () => {
				this.engine.lock();
			}
		}
		this.scheduler.add(player, true);
		return player;
	}


	entityAt(entities, coords) {
		for(let i = 0; i < entities.length; i++) {
			if(entities[i].coords[0] == coords[0] && entities[i].coords[1] == coords[1]) {
				return entities[i];
			}
		}
		return false;
	}

	attack(entity) {
		return Math.random() >= .5 ? this.removeEntity(entity) : false;
	}

	
	render() {
		return (
			<div>
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