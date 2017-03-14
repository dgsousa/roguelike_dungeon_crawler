import React from 'react';
import ReactDOM from 'react-dom';
import * as ROT from '../bower_components/rot.js/rot.js'
import './scss/application.scss';



class Tile extends React.Component {	
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



class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: {
				coords: []
			}
		}
	}

	componentWillMount() {
		this.setState(this.props);
	}

	componentWillReceiveProps(nextProps, nextState) {
		this.setState(nextProps);
	}

	render() {
		let style = {
			top: this.state.player.coords[1] * 30,
			left: this.state.player.coords[0] * 30
		}
		return (
			<div
				className={'player yoda'}
				style={style}>
			</div>
		)
	}
}




class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {
				top: null,
				left: null
			},
			player: {
				coords: []
			}
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

	componentWillMount() {
		this.state.style = {top: -300, left: 0}
		this.state.player = {coords: [16, 17]}
		this.setState(this.state);
	}

	scroll(e) {
		e.preventDefault();
		if(e.keyCode === 38 && this.state.player.coords[1] > 0) {
			if(this.state.style.top < 0 && this.state.player.coords[1] < 43) this.scrollScreen(0,30);
			this.movePlayer(0, -1)
		} else if(e.keyCode === 40 && this.state.player.coords[1] < this.props.height - 1) {
			if(this.state.style.top > -1050 && this.state.player.coords[1] > 6) this.scrollScreen(0,-30)
			this.movePlayer(0, 1)
		} else if(e.keyCode === 37 && this.state.player.coords[0] > 0) {
			if(this.state.style.left < 0 && this.state.player.coords[0] < 33) this.scrollScreen(30, 0)
			this.movePlayer(-1, 0)
		} else if(e.keyCode === 39 && this.state.player.coords[0] < this.props.width - 1) {
			if(this.state.style.left > -450 && this.state.player.coords[0] > 16) this.scrollScreen(-30, 0)
			this.movePlayer(1, 0)
		}
	}

	scrollScreen(x, y) {
		this.setState({
			style: {
				top: this.state.style.top + y,
				left: this.state.style.left + x
			}
		})	
	}

	movePlayer(x, y) {
		let coords = this.state.player.coords;
		this.setState({
			player: {
				coords: [coords[0] + x, coords[1] + y]
			}
		})
	}

	render() {
		let tiles = this.getTiles();			
		return (
			<div 
				className={"board"}
				style={this.state.style}
				tabIndex="0"
				onKeyDown={this.scroll.bind(this)}>
				<Player 
					player={this.state.player}/>
				{tiles}
			</div>
		)
	}
}






class App extends React.Component {	
	constructor(props) {
		super(props)
		this.state = {
			map: []
		}
	}

	componentWillMount() {
		this.createMap();
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

		this.setState({map: map});
	}
	
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


