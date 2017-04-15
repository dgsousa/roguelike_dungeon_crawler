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
			return Object.assign({}, state, 
				{
					player: new Entity({
						...action.player,
						coords: action.coords
					})
				},
				{
					occupiedSquares: {
						[`${action.coords[0]}x${action.coords[1]}`]: action.player._type
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
						...state.occupiedSquares,
						[`${action.prevCoords[0]}x${action.prevCoords[1]}`]: false,
						[`${action.nextCoords[0]}x${action.nextCoords[1]}`]: state.player._type
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
						[`${action.nextCoords[0]}x${action.nextCoords[1]}`]: state.player._type
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
				return new Entity(entity);
			})
			
			return {
				...state,
				entities: [ ...entities],
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



