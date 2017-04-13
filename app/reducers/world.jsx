import * as WorldActionTypes from "../actiontypes/world.jsx";

const World = (state, action) => {
	
	switch(action.type) {

	case WorldActionTypes.CREATE_WORLD: {
		return {
			...state,
			world: action.world
		}
	}

	default:
		return state;
	}
}

export default World;