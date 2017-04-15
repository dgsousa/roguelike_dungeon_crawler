import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";
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
			const player = action.player[0];
			const occupiedSquares = {[`${action.player[0].coords[0]}x${action.player[0].coords[1]}`]: action.player[0]._type}
			return { ...state, player, occupiedSquares }	
		}

		case PlayerActionTypes.MOVE_PLAYER: {
			return Object.assign({}, state, 
				{
					player: action.player
				},
				{
					occupiedSquares: {
						...state.occupiedSquares,
						[`${action.prevCoords[0]}x${action.prevCoords[1]}`]: false,
						[`${action.player.coords[0]}x${action.player.coords[1]}`]: action.player._type
					}
				}
			)
		}

		case PlayerActionTypes.GO_UPSTAIRS: {
			return Object.assign({}, state, 
				{
					player: action.player
				},
				{
					occupiedSquares: {
						[`${action.prevCoords[0]}x${action.prevCoords[1]}`]: false,
						[`${action.player.coords[0]}x${action.player.coords[1]}`]: action.player._type
					}
				},
				{
					floor: state.floor + 1
				}
			)
		}

		case EntityActionTypes.ADD_ENTITIES: {
			const occupiedSquares = Object.assign({}, state.occupiedSquares);
			const entities = action.entities.map((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
				return entity;
			})
			
			return { ...state, entities, occupiedSquares }
		}

		case LightActionTypes.SWITCH_LIGHTS: {
			return {
				...state,
				lightsOn: !state.lightsOn
			}
		}

		default:
			return state;
	}
}




export default Reducer;



