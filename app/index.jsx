import React from 'react';
import ReactDOM from 'react-dom';
import * as ROT from '../bower_components/rot.js/rot.js'
import './scss/application.scss';



class Tile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {
				top: this.props.row * 15,
				left: this.props.column * 10
			}
		}
	}
	
	render() {
		return(
			<div 
				className="tile"
				style={this.state.style}>
			</div>
		)
	}
}


class Board extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			style: {
				width: this.props.width * 10,
				height: this.props.height * 15,
			}
		}
	}

	render() {
		let tiles = [];
		let area = this.props.width * this.props.height;
		for(let i = 0; i < area; i++) {
			let column = i % this.props.width;
			let row = Math.floor(i / this.props.width)
			tiles.push(<Tile key={i} column={column} row={row}/>)
		}
		
		return (
			<div 
				className="board"
				style={this.state.style}>	
				{tiles}
			</div>
		)
	}
}




class App extends React.Component {	
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		let map = [];
		let generator = new ROT.Map.Cellular(this.props.width, this.props.height);
		generator.randomize(.5);
		for(let i = 0; i < 3; i++) {
			generator.create();
		}
		generator.create((x,y,v)=>{
			v === 1 ? map[x][y] = true : map[x][y] = false;
		})
		console.log(map);
	}
	
	render() {
		return (
			<Board
				width={this.props.width}
				height={this.props.height}>
			</Board>
		)
	}
}

ReactDOM.render(<App width={100} height={40}/>, document.getElementById('app'));


