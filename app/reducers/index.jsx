import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


const Reducer = (state = {}, action) => {
	switch(action.type) {
		case WorldActionTypes.CREATE_WORLD: {
			return Object.assign({}, state, 
				{
					world: action.world
				}
			);
		}

		case PlayerActionTypes.MOVE_PLAYER: {
			return Object.assign({}, state, 
				{
					entities: [action.player, ...state.entities.slice(1)]
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
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			return Object.assign({}, state, 
				{
					entities: action.entities
				},
				{
					occupiedSquares: occupiedSquares
				},
				{
					floor: state.floor + 1
				}
			)
		}

		case EntityActionTypes.ADD_ENTITIES: {
			const occupiedSquares = Object.assign({}, state.occupiedSquares);
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			
			return { 
					...state, 
					entities: action.entities, 
					occupiedSquares: occupiedSquares 
				}
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



