import React, {Component, Proptypes} from 'react';



export default class Message extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const items = this.props.message.map((item, key) => {
			return (
				<span 
					key={key}>
					{item}<br/>
				</span>
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