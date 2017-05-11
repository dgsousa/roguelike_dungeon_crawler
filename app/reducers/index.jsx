


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

	case "CREATE_ENTITY": {
		return {
			...state,
			entities: [...state.entities, action.entity],
			occupiedSquares: {
				...state.occupiedSquares,
				[`${action.entity.coords[0]}x${action.entity.coords[1]}`]: action.entity._type 
			}
		};
	}

	case "MOVE_ENTITY": {
		return {
			...state,
			entities: [	
				...state.entities.slice(0, action.index), 
				{ ...state.entities[action.index], coords: action.coords}, 
				...state.entities.slice(action.index + 1)
			],
			occupiedSquares: {
				...state.occupiedSquares,
				[`${state.entities[action.index].coords[0]}x${state.entities[action.index].coords[1]}`]: false,
				[`${action.coords[0]}x${action.coords[1]}`]: state.entities[action.index]._type
			}
		};
	}

	case "UPDATE_MESSAGE": {
		return {
			...state,
			message: action.message
		};
	}

	case "GO_UPSTAIRS": {
		return {
			...state,
			entities: [{...state.entities[0], coords: action.coords}],
			occupiedSquares: {
				[`${action.coords[0]}x${action.coords[1]}`]: state.entities[0]._type
			},
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



