import React, { PropTypes} from "react";



const Message = ({message}) => {

	return (
		<div 
			className={"message"}>
			{ message.map((item, key) => (
				<p 
					key={key}
					className="message-text">
					{item}<br/>
				</p>
				))
			}
		</div>
	);	
};

export default Message;


React.propTypes = {
	player: PropTypes.array.isRequired,
};