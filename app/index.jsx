import React from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';


class Td extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			color: "white",
			coords: {
				x: this.props.x,
				y: this.props.y
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps) {
			this.setState({
				coords: nextProps.coords
			})
		}
		this.locatePiece();
	}

	componentWillMount() {
		this.locatePiece();
	}

	locatePiece() {
		if(this.props.row === this.props.coords.y && this.props.col === this.props.coords.x) {
			this.state.color = "red";
		} else {
			this.state.color = "white";
		}
		this.setState({
			color: this.state.color
		})
	}


	render() {
		return(
			<td className = {this.state.color}></td>
		)
	}
}



class Tr extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var td = this.props.board[this.props.row].map(function(array, col) {
			return (
				<Td 
					key={col}
					col={col}
					row={this.props.row}
					coords={this.props.coords}
					board={this.props.board}></Td>
			)
		}.bind(this))
		
		return(
			<tr>
				{td}
			</tr>
		)
	}
}




class Table extends React.Component {
	constructor(props) {
		super(props);
		}

	render() {
		var tr = this.props.board.map(function(array, row) {
			return (
				<Tr
					key={row}
					row={row}
					coords={this.props.coords}
					board={this.props.board}>Hello</Tr>
			)
		}.bind(this))

		return (
			<table>
				<tbody>
					{tr}
				</tbody>
			</table>
			
		)
	}
}



class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			board: [],
			coords: {
				x: 24,
				y: 15
			},
			style: {
				top: 0
			}
		}
	}

	createBoard() {
		let board = [];
		for(let i = 0; i < this.props.height; i++) {
			let row = [];
			for(let j = 0; j < this.props.width; j++) {
				let square = false;
				row.push(square);
			}
			board.push(row);
		}
		this.setState({
			board: board
		})
	}

	componentWillMount() {
		this.createBoard();
		window.addEventListener('keydown', this.changeCoords.bind(this))
	}

	changeCoords(e) {
		if(e.keyCode === 37 && this.state.coords.x >= 1) {
			this.state.coords.x -= 1;
		} else if(e.keyCode === 38 && this.state.coords.y >= 1) {
			this.state.coords.y -= 1;
			this.state.style.top += 20;
		} else if(e.keyCode === 39 && this.state.coords.x <= (this.props.width - 2)) {
			this.state.coords.x += 1;
		} else if(e.keyCode === 40 && this.state.coords.y <= (this.props.height - 2)) {
			this.state.coords.y += 1;
			this.state.style.top -= 20;
		}
		this.setState({
			coords: this.state.coords,
			style: this.state.style
		})
	}

	render() {
		return (
			<div className='container'>
				<div 
					style={{top: `${this.state.style.top}px`}}
					className='main'>
					<Table 
						id="board"
						board={this.state.board} 
						coords={this.state.coords}
						/>				
				</div>
			</div>
		)
	}
}


ReactDOM.render(<App width={50} height={50}/>, document.getElementById('app'));