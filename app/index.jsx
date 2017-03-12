import React from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';



class Square extends React.Component {
	constructor(props) {
		super(props)

	}

	render() {
		let style = {
			top: this.props.row * 10,
			left: this.props.column * 10
		}
		
		return (
			<div
				style={style}
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


