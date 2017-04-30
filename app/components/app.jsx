import React, {Component, PropTypes, createElement} from "react";
import {connect} from "react-redux";
import ActionCreators from "../actions/index.jsx";
import Stats from "./stats.jsx";
import Restart from "./restart.jsx";
import Message from "./message.jsx";




class App extends Component {		

	componentWillMount() {
		const { setupFloor } = this.props;
		setupFloor();
	}


	// componentDidUpdate(prevProps) {
	// 	if(this.props.world !== prevProps.world) {
	// 		this.setupBoard();
	// 	}
	// }

	// restart() {
	// 	const {width, height, depth, createWorld} = this.props;
	// 	createWorld(new World(width, height, depth));
	// }


	


	// checkForItem(player) {
	// 	const { items } = this.props;
	// 	const message = [];
	// 	items.filter((item) => {
	// 		if(item.coords[0] == player.coords[0] && item.coords[1] == player.coords[1]) {
	// 			player._hp += item._hp || 0;
	// 			player._weapon = item._weapon || player._weapon;
	// 			player._attackValue += item._attackValue || 0;
	// 			message.push(`You picked up a ${item._type}`);
	// 		} else {
	// 			return item;
	// 		}
	// 	});
	// 	return { player, message, items };
	// }

	

	

	


	getTileClass(x, y) {
		const {world, floor, entities: [player], occupiedSquares, lightsOn } = this.props;
		const map = world._regions[floor];
		const visibleCells = this.getVisibleCells(player.coords);
		const chars = {
			"0": "wall",
			"1": "floor",
			"2": "floor",
			"3": "floor",
			"5": "stairs",
			"6": "grey"
		};
		return 	visibleCells[`${x},${y},${floor}`] || lightsOn ?
					occupiedSquares[`${x}x${y}`] || chars[map[x][y]] :
					chars["6"];
	}


	setUpBoard() {
		const { width, height, entities: [player] } = this.props;
		const screenX = Math.max(0, Math.min(player.coords[0] - 12, width - 25));
		const screenY = Math.max(0, Math.min(player.coords[1] - 7, height - 15));
		const rows = [];
		for(let y = screenY; y < screenY + 15; y++) {
			let row = [];
			for(let x = screenX; x < screenX + 25; x++) {
				const tileClass = this.getTileClass(x, y);
				row.push(createElement("div", {	
					className: "tile " + tileClass, 
					key: x+"x"+y, 
					style: {left: 30 * (x - screenX)}}, " "));
			}
			rows.push(createElement("div", {
				className: "row", 
				key: y
			}, row));
		}
		return rows;
	}

	getVisibleCells(playerCoords) {
		const {world, floor} = this.props;
		const visibleCells = {};
		world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y) => {
			visibleCells[`${x},${y},${floor}`] = true;
		});
		return visibleCells;
	}

	// checkGameStatus(player) {
	// 	return 	player._hp <= 0 ? "You Lose!" : 
	// 			player._experience > 1000 ? "You Win!" : false;
	// }

	
	


	render() {
		const { scroll, lightsOn, switchLights, entities, gameEnd } = this.props;
		const rows = this.setUpBoard();
		return (
			<div>
				<Message 
					className={"message"} 
					message={["Placeholder"]}/>
				<div
					className="board"
					tabIndex={"0"}
					onKeyDown={scroll}>
					<Restart 
						gameEnd={gameEnd}/>			
					<Stats player={entities[0]}/>
					{rows}
					<button 
						className="lights"
						onClick={switchLights}>
						{lightsOn ? "Turn Lights Off" : "Turn Lights On"}
					</button>
				</div>
			</div>	
		);
	}
}


const mapStateToProps = (state) => ({
	world: state.world,
	floor: state.floor,
	entities: state.entities,
	occupiedSquares: state.occupiedSquares,
	width: state.width,
	height: state.height,
	depth: state.depth,
	lightsOn: state.lightsOn,
	gameEnd: state.gameEnd
});

export default connect(
	mapStateToProps,
	{
		createWorld: ActionCreators.createWorld,
		setupFloor: ActionCreators.setupFloor,
		scroll: ActionCreators.scroll,
		switchLights: ActionCreators.switchLights
	}
)(App);

React.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	depth: PropTypes.number.isRequired
};








