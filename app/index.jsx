import React from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';








class Room extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {}
		}
	}

	componentWillMount() {
		this.generateDimensions();
	}

	generateDimensions() {
		let style = {
			top: Math.floor(Math.random() * 500),
			left: Math.floor(Math.random() * 1000),
			width: Math.floor(Math.random() * 100 + 50),
			height: Math.floor(Math.random() * 100 + 50)
		}
		this.state.style = style;
		this.setState(this.state);	
	}

	render() {
		return(
			<div className="room"
				 style={this.state.style}>
			</div>
		)
	}
}




class Board extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let rooms = [];
		for(let i = 0; i < 5; i++) {
			rooms.push(<Room key={i}></Room>)
		}
		
		return (
			<div className="board">	
				{rooms}
			</div>
		)
	}
}






class App extends React.Component {	
	constructor(props) {
		super(props)
	}
	
	
	render() {
		return (
			<Board>
			</Board>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));


