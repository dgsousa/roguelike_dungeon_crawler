import React, {Component, Proptypes} from 'react';



export default class Message extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const items = this.props.message.map((item, key) => {
			return (
				<p 
					key={key}
					className="message-text">
					{item}<br/>
				</p>
			)
		})


		return (
			<div 
				className={'message'}>
				{items}
			</div>
		)	
	}
}