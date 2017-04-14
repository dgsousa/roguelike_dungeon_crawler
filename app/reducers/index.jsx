import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes } from "../actiontypes/index.jsx";
import Entity from "../scripts/entity.js";

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
					player: new Entity({
						...action.player,
						coords: action.coords
					})
				},
				{
					occupiedSquares: {
						[`${action.coords[0]}x${action.coords[1]}`]: "astro"
					}
				}
			)
		}

		case PlayerActionTypes.MOVE_PLAYER: {
			return Object.assign({}, state, 
				{
					player: new Entity({
						...state.player,
						coords: action.nextCoords
					})
				},
				{
					occupiedSquares: {
						[`${action.prevCoords[0]}x${action.prevCoords[1]}`]: false,
						[`${action.nextCoords[0]}x${action.nextCoords[1]}`]: "astro"
					}
				}
			)
		}

		case PlayerActionTypes.GO_UPSTAIRS: {
			return Object.assign({}, state, 
				{
					player: new Entity({
						...state.player,
						coords: action.nextCoords
					})
				},
				{
					occupiedSquares: {
						[`${action.prevCoords[0]}x${action.prevCoords[1]}`]: false,
						[`${action.nextCoords[0]}x${action.nextCoords[1]}`]: "astro"
					}
				},
				{
					floor: state.floor + 1
				}
			)
		}

		default:
			return state;
	}
}




export default Reducer;



