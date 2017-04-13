import * as WorldActionTypes from "../actiontypes/world.jsx";

export default function World(state, action) {
	
	switch(action.type) {

	case WorldActionTypes.CREATE_WORLD: {
		return {
			...state,
			world: action.world,
			isLoading: action.isLoading
		}
	}

	default:
		return state;
	}
}