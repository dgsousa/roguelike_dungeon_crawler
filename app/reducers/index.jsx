import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes } from "../actiontypes/index.jsx";

const world = (state = [], action) => {
	switch(action.type) {
		case WorldActionTypes.CREATE_WORLD: {
			return action.world;
		}
		default:
			return state;
	}
}


const player = (state = {}, action) => {
	switch(action.type) {
		case PlayerActionTypes.ADD_PLAYER: {	
			return {
					...action.player,
					coords: action.coords
			}
		}
		default: 
			return state;
	}
}



const Reducer = combineReducers({
	world,
	player
})

export default Reducer;



