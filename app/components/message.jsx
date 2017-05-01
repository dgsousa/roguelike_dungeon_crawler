import React, { PropTypes} from "react";
import {connect} from "react-redux";


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

const mapStateToProps = (state) => ({
	message: state.message
});

export default connect(mapStateToProps)(Message);


React.propTypes = {
	player: PropTypes.array.isRequired,
};