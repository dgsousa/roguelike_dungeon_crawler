


const Reducer = (state = {}, action) => {
	switch(action.type) {
	case "CREATE_WORLD": {
		return  {
			...state,
			world: action.world
		};
	}

	case "FILL_FLOOR": {
		return { 
			...state, 
			player: action.player, 
			occupiedSquares: action.occupiedSquares,
			floor: action.floor
		};
	}

	case "MOVE": {
		return  {
			...state,
			player: action.player,
			occupiedSquares: action.occupiedSquares,
		};
	}

	// case "FIGHT": {
	// 	return {
	// 		...state,
	// 		entities: action.entities,
	// 		message: action.message,
	// 		gameEnd: action.gameEnd,
	// 		occupiedSquares: action.occupiedSquares
	// 	};
	// }

	case "SWITCH_LIGHTS": {
		return {
			...state,
			lightsOn: !state.lightsOn
		};
	}

	default:
		return state;
	}
};




export default Reducer;



