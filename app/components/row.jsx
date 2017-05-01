import React, {Component} from "react";
import {connect} from "react-redux";



class Row extends Component {


	render() {
		const { screenX, y } = this.props;
		const tiles = [];
		for(let x = screenX; x < screenX + 25; x++) {
			tiles.push(<div className="tile wall" key={x+"x"+y} style={{left: 30 * (x - screenX)}}></div>);
		}
		return (
			<div className="row">
				{tiles}
			</div>
		);
	}
}


const mapStateToProps = (state, ownProps) => ({
	width: state.width,
	player: state.entities[0],
	y: ownProps.y,
	screenX: Math.max(0, Math.min(state.entities[0].coords[0] - 12, state.width - 25))
});

export default connect(mapStateToProps)(Row);


// React.propTypes = {
// 	world: PropTypes.array.isRequired,
// 	floor: PropTypes.number.isRequired,
// 	entities: PropTypes.array.isRequired,
// 	occupiedSquares: PropTypes.array.isRequired,
// 	lightsOn: PropTypes.bool.isRequired,
// 	height: PropTypes.number.isRequired,
// 	width: PropTypes.number.isRequired,
// 	depth: PropTypes.number.isRequired,
// };


