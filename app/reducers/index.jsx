


const Reducer = (state = {}, action) => {
	switch(action.type) {
	case "CREATE_WORLD": {
		return  {
			...state,
			world: action.world,
			gameEnd: false,
			floor: 0
		};
	}

	case "FILL_FLOOR": {
		return { 
			...state, 
			entities: action.entities, 
			occupiedSquares: action.occupiedSquares,
			message: action.message
		};
	}

	case "GO_UPSTAIRS": {
		return {
			...state,
			floor: state.floor + 1
		};
	}

	case "SWITCH_LIGHTS": {
		return {
			...state,
			lightsOn: !state.lightsOn
		};
	}

	case "GAME_OVER": {
		return {
			...state,
			gameEnd: action.gameEnd
		};
	}

	default:
		return state;
	}
};




export default Reducer;



