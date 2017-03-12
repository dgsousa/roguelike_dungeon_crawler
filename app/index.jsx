import React from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';



class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {
				top: this.props.row * 10,
				left: this.props.column * 10,
				background: 'white'
			}
		}

	}

	render() {
		
		return (
			<div
				style={this.state.style}
				className={"square"}>
			</div>
		)
	}
}




class Board extends React.Component {

	constructor(props) {
		super(props)
	}


	render() {
		let style = {
			width: this.props.width * 10,
			height: this.props.height * 10,
			border: "1px solid blue"
		}
		
		let squares = this.props.board.map(function(square, i) {	
		let row = this.props.board[i][0];
		let column = this.props.board[i][1];

		return (
			
			<Square 
				className={"square"}
				key={i}
				row={row}
				column={column}/>
			)
		}.bind(this))

		return (
			<div style={style}>
				{squares}
			</div>
		)
	}
}




class App extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			width: this.props.width,
			height: this.props.height,
			board: []
		}
	}

	
	componentWillMount() {
		this.createBoard();
		//window.addEventListener('keydown', this.changeCoords.bind(this))
	}

	// changeCoords(e) {
	// 	if(e.keyCode === 37 && this.state.coords.x >= 1) {
	// 		this.state.coords.x -= 1;
	// 	} else if(e.keyCode === 38 && this.state.coords.y >= 1) {
	// 		this.state.coords.y -= 1;
	// 		this.state.style.top += 20;
	// 	} else if(e.keyCode === 39 && this.state.coords.x <= (this.props.width - 2)) {
	// 		this.state.coords.x += 1;
	// 	} else if(e.keyCode === 40 && this.state.coords.y <= (this.props.height - 2)) {
	// 		this.state.coords.y += 1;
	// 		this.state.style.top -= 20;
	// 	}
	// 	this.setState({
	// 		coords: this.state.coords,
	// 		style: this.state.style
	// 	})
	// }

	createBoard() {
		let board = [];
		let area = this.props.height * this.props.width;
		for(let i = 0; i < area; i++) {
			let row = Math.floor(i / this.props.height)
			let column = i % this.props.height;
			board.push([row, column]);
		}
		this.state.board = board;
		this.setState(this.state);
	}
	
	render() {

		return (
			<Board 
				board={this.state.board}
				width={this.props.width}
				height={this.props.height}/>
		)
	}

}


ReactDOM.render(<App width={100} height={100}/>, document.getElementById('app'));


