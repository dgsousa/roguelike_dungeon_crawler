import React from 'react';
import ReactDOM from 'react-dom';
import * as ROT from '../bower_components/rot.js/rot.js'
import './scss/application.scss';



const Tile = props => {		
	return(
		<div 
			className="tile"
			style={props.style}>
		</div>
	)	
}


class Board extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let width = this.props.width;
		let tiles = this.props.map.map(function(tile, i) {
			let background = tile ? 'white' : 'grey';
			let style = {
				top: Math.floor(i/width) * 15,
				left: (i % width) * 10,
				background: background
			}
			return (<Tile key={i} style={style}/>) 
			
		})
				
		return (
			<div 
				className="board"
				style={{width: this.props.width * 10, 
						height: this.props.height * 15}}>	
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
		let map = [];
		let area = this.props.width * this.props.height
		for(let i = 0; i < area; i++) {
			map.push([]);
		}

		let generator = new ROT.Map.Cellular(this.props.width, this.props.height);
		generator.randomize(.5);
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
			<Board
				map={this.state.map}
				width={this.props.width}
				height={this.props.height}>
			</Board>
		)
	}
}

ReactDOM.render(<App width={100} height={50}/>, document.getElementById('app'));


