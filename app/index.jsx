import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import * as ROT from '../bower_components/rot.js/rot.js'
import './scss/application.scss';



class Tile extends Component {	
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.style.top === nextProps.style.top && this.props.style.left === nextProps.style.left && this.props.style.color === nextProps.style.color) {
			return false;
		}
		return true;
	}

	componentWillUpdate() {
		console.log('test');
	}
	
	render() {
		return (
			<div 
				className={"tile " + this.props.char}
				style={this.props.style}>
			</div>
		)	
	}
}


class Player extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let style = {
			top: this.props.player.coords[1] * 30,
			left: this.props.player.coords[0] * 30
		}
		return (
			<div
				className={'player yoda'}
				style={style}>
			</div>
		)
	}
}


class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			player: {
				coords: [12, 7]
			},
			coords: [0, 0]
		}
	}

	getTiles() {
		let width = this.props.width;
		let tiles = this.props.map.map((tile, i)=> {
			let color = tile ? 'black' : 'goldenrod';
			let char = tile ? '' : 'chewy'
			let style = {
				top: Math.floor(i/width) * 30,
				left: (i % width) * 30,
				color: color
			}
			return (<Tile key={i} style={style} char={char}/>) 	
		})
		return tiles;
	}

	

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
	}

	scrollScreen(x, y) {	
		let playerX = Math.max(0, Math.min(this.props.width - 1, this.state.player.coords[0] + x));
	 	let playerY = Math.max(0, Math.min(this.props.height - 1, this.state.player.coords[1] + y));
		let screenX = Math.max(0, Math.min(playerX - 12, this.props.width - 25));
		let screenY = Math.max(0, Math.min(playerY - 7, this.props.height - 15));
		let coords = [screenX, screenY];
		this.setState({
			coords: coords,
			player: {
				coords: [playerX, playerY]
			}
		})	
	}
	

	render() {
		let tiles = this.getTiles();
		let style = {
			top: -this.state.coords[1] * 30,
			left: -this.state.coords[0] * 30
		}
			
		return (
			<div 
				className={"board"}
				style={style}
				tabIndex={"0"}
				onKeyDown={this.scroll.bind(this)}>
				<Player 
					player={this.state.player}/>
				{tiles}
			</div>
		)
	}
}




class App extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: []
		}
	};
	

	componentWillMount() {
		this.createMap();
	};

	

	createMap() {
		let map = [];
		let area = this.props.width * this.props.height
		for(let i = 0; i < area; i++) {
			map.push([]);
		}
		let generator = new ROT.Map.Cellular(this.props.width, this.props.height);
		generator.randomize(.52);
		for(let i = 0; i < 10 ; i++) {
			generator.create();
		}		
		generator.create((x,y,v)=>{
			let i = y * this.props.width + x;
			v === 1 ? map[i] = true : map[i] = false;
		})
		this.setState({map: map});
	};


	
	render() {
		return (
			<div>
				<div className={'view'}>				
					<Board
						map={this.state.map}
						width={this.props.width}
						height={this.props.height}>
					</Board>
				</div>
			</div>
			
		)
	}
}

ReactDOM.render(<App width={50} height={50}/>, document.getElementById('app'));


