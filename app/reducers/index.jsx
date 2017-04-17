import { combineReducers } from "redux";
import { WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes, ItemActionTypes } from "../actiontypes/index.jsx";


const Reducer = (state = {}, action) => {
	switch(action.type) {
		case WorldActionTypes.CREATE_WORLD: {
			return  {
				...state,
				world: action.world
			}
		}

		case EntityActionTypes.MOVE_ENTITIES: {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			return  {
				...state,
				entities: action.entities,
				occupiedSquares: occupiedSquares,
				items: items = state.items.filter((item) => {
					if(item.coords[0] != action.entities[0].coords[0] || item.coords[1] != action.entities[0].coords[1]) {
						return item;
					} 
				}),
				itemSquares: {
					...state.itemSquares,
					[`${action.entities[0].coords[0]}x${action.entities[0].coords[1]}`]: false
				}
			}
		}

		case EntityActionTypes.ADD_ENTITIES: {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			});
			return { 
				...state, 
				entities: action.entities, 
				occupiedSquares: occupiedSquares,
				floor: action.floor 
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



