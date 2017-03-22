import React, {Component, PropTypes} from 'react';
import * as ROT from '../../bower_components/rot.js/rot.js';
import Board from './board.jsx';



export default class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {
				coords: []
			},
			coords: []
		}
	};
	
	componentWillMount() {
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
		let x, y;
		const area = this.props.width * this.props.height
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

		do {
			x = Math.floor(Math.random() * this.props.width);
			y = Math.floor(Math.random() * this.props.height);
		} while (!map[y * this.props.width + x]);

		this.setState({
			map: map,
			player: {
				coords: [x, y]
			},
			coords: [Math.max(0, Math.min(x - 12, this.props.width - 25)), Math.max(0, Math.min(y - 7, this.props.height - 15))]
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
	};


	scrollScreen(x, y) {	
		const playerX = Math.max(0, Math.min(this.props.width - 1, this.state.player.coords[0] + x));
	 	const playerY = Math.max(0, Math.min(this.props.height - 1, this.state.player.coords[1] + y));
		const screenX = Math.max(0, Math.min(playerX - 12, this.props.width - 25));
		const screenY = Math.max(0, Math.min(playerY - 7, this.props.height - 15));
		if(this.state.map[(playerY * this.props.width) + playerX]) {
			const coords = [screenX, screenY];
			this.setState({
				coords: coords,
				player: {
					coords: [playerX, playerY]
				}
			})
		} else {
			this.dig(playerX, playerY);
		}
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
						dig={this.dig.bind(this)}
						player={this.state.player}
						coords={this.state.coords}>
					</Board>
				</div>
			</div>
			
		)
	}
}