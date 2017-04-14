import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes } from "../actiontypes/index.jsx";

const Reducer = (state = {}, action) => {
	switch(action.type) {
		case WorldActionTypes.CREATE_WORLD: {
			return Object.assign({}, state, 
				{
					world: action.world
				}
			);
		}

		case PlayerActionTypes.ADD_PLAYER: {	
			return Object.assign({}, state, 
				{
					player: {
						...action.player,
						coords: action.coords
					}
				},
				{
					occupiedSquares: {
						[`${action.coords[0]}x${action.coords[1]}`]: "astro"
					}
				}
			)
		}

		default:
			return state;
	}
}




export default Reducer;



