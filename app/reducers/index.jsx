


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

	// case "MOVE_ENTITIES": {
	// 	return  {
	// 		...state,
	// 		entities: action.entities,
	// 		occupiedSquares: action.occupiedSquares,
	// 		items: action.items,
	// 		itemSquares: {
	// 			...state.itemSquares,
	// 			[`${action.entities[0].coords[0]}x${action.entities[0].coords[1]}`]: false
	// 		},
	// 		message: action.message
	// 	};
	// }

	// case "FIGHT": {
	// 	return {
	// 		...state,
	// 		entities: action.entities,
	// 		message: action.message,
	// 		gameEnd: action.gameEnd,
	// 		occupiedSquares: action.occupiedSquares
	// 	};
	// }

	// case "SWITCH_LIGHTS": {
	// 	return {
	// 		...state,
	// 		lightsOn: !state.lightsOn
	// 	};
	// }

	default:
		return state;
	}
};




export default Reducer;



