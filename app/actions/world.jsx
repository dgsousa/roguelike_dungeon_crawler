import * as WorldActionTypes from "../actiontypes/world.jsx";

export const createWorld = (world) => {
	return {
		type: WorldActionTypes.CREATE_WORLD,
		world
	}
}