import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes, ItemActionTypes } from "../actiontypes/index.jsx";


const Reducer = (state = {}, action) => {
	switch(action.type) {
		case WorldActionTypes.CREATE_WORLD: {
			return Object.assign({}, state, 
				{
					world: action.world
				}
			);
		}

		case EntityActionTypes.MOVE_ENTITIES: {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			return  {
				...state,
				entities: action.entities,
				occupiedSquares: occupiedSquares
			}
		}

		case EntityActionTypes.ADD_ENTITIES: {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			return { 
				...state, 
				entities: action.entities, 
				occupiedSquares: occupiedSquares,
				floor: action.floor 
			}
		}

		case LightActionTypes.SWITCH_LIGHTS: {
			return {
				...state,
				lightsOn: !state.lightsOn
			}
		}

		case ItemActionTypes.ADD_ITEMS: {
			const itemSquares = {};
			action.items.forEach((item) => {
				itemSquares[`${item.coords[0]}x${item.coords[1]}`] = item._type
			})
			return {
				...state,
				items: action.items,
				itemSquares: itemSquares
			}
		}

		default:
			return state;
	}
}




export default Reducer;



