import React, { PropTypes} from "react";
import {connect} from "react-redux";


const Message = ({message}) => (
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


const mapStateToProps = (state) => ({
	message: state.message
});

export default connect(mapStateToProps)(Message);


Message.propTypes = {
	message: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};