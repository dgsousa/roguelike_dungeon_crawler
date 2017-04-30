


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
			entities: action.entities, 
			occupiedSquares: action.occupiedSquares,
			message: action.message
		};
	}

	case "MOVE": {
		return  {
			...state,
			entities: action.entities,
			occupiedSquares: action.occupiedSquares,
		};
	}

	case "GO_UPSTAIRS": {
		return {
			...state,
			floor: state.floor + 1
		};
	}

	case "FIGHT": {
		return {
			...state,
			entities: action.entities,
			occupiedSquares: action.occupiedSquares
		};
	}

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



