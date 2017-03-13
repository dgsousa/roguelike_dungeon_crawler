import React from 'react';
import ReactDOM from 'react-dom';
import * as ROT from '../bower_components/rot.js/rot.js'
import './scss/application.scss';



const Tile = props => {		
	return(
		<div 
			className="tile"
			style={props.style}>{props.text}
		</div>
	)	
}



class Player extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let style = {
			top: this.props.player.coords[1] * 15,
			left: this.props.player.coords[0] * 10
		}
		return (
			<div
				className={'player'}
				style={style}>@		
			</div>
		)
	}
}




class Board extends React.Component {
	constructor(props) {
		super(props)
	}

	getTiles() {
		let width = this.props.width;
		let tiles = this.props.map.map((tile, i)=> {
			let color = tile ? 'black' : 'goldenrod';
			let text = tile ? '.' : '#';
			let style = {
				top: Math.floor(i/width) * 15,
				left: (i % width) * 10,
				color: color,
				content: '!'
			}
			return (<Tile key={i} style={style} text={text}/>) 	
		})
		return tiles;
	}



	render() {
		let tiles = this.getTiles();
				
		return (
			<div 
				className="board">
				<Player 
					player={this.props.player}/>
				{tiles}
			</div>
		)
	}
}





class App extends React.Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: [],
			player: {
				coords: []
			}
		}
	}

	componentWillMount() {
		this.createMap();
		window.addEventListener('keydown', this.changeCoords.bind(this))
		this.initializePlayer(50, 30)
	}

	initializePlayer(x, y) {
		this.state.player.coords = [x, y],
		this.setState(this.state);
	}

	changeCoords(e) {
		console.log(e.keycode);

	}

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
		this.state.map = map;
		this.setState(this.state);
	}
	
	render() {
		return (
			<div>
				<div className={'view'}>
				
					<Board
						map={this.state.map}
						player={this.state.player}
						width={this.props.width}
						height={this.props.height}>
					</Board>
				</div>
			</div>
			
		)
	}
}

ReactDOM.render(<App width={100} height={100}/>, document.getElementById('app'));


