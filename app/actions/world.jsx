import * as WorldActionTypes from "../actiontypes/world.jsx";

export const createWorld = (world, isLoading) => {
	return {
		type: WorldActionTypes.CREATE_WORLD,
		world,
		isLoading
	}
}