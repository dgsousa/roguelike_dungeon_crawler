import React from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';





class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			width: this.props.width,
			height: this.props.height
		}
	}

	render() {




		return (
				<div
				className = {'table'}
				></div>
		)
	}

}

ReactDOM.render(<App width={50} height={50}/>, document.getElementById('app'));