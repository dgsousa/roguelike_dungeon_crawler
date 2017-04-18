import { combineReducers } from "redux";


const Reducer = (state = {}, action) => {
	switch(action.type) {
		case "CREATE_WORLD": {
			return  {
				...state,
				world: action.world,
				gameEnd: false,
				tester: state.tester + 1
			}
		}

		case "FILL_FLOOR": {
			const occupiedSquares = {};
			const itemSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			});
			action.items.forEach((item) => {
				itemSquares[`${item.coords[0]}x${item.coords[1]}`] = item._type
			})
			return { 
				...state, 
				entities: action.entities, 
				items: action.items,
				occupiedSquares: occupiedSquares,
				itemSquares: itemSquares,
				floor: action.floor,
				message: action.message 
			}
		}

		case "MOVE_ENTITIES": {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type 
			})
			return  {
				...state,
				entities: action.entities,
				occupiedSquares: occupiedSquares,
				items: action.items,
				itemSquares: {
					...state.itemSquares,
					[`${action.entities[0].coords[0]}x${action.entities[0].coords[1]}`]: false
				},
				message: action.message
			}
		}

		case "FIGHT": {
			const occupiedSquares = {};
			action.entities.forEach((entity) => {
				occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type
			})
			return {
				...state,
				entities: action.entities,
				message: action.message,
				gameEnd: action.gameEnd,
				occupiedSquares: occupiedSquares
			}
		}

		

		case "SWITCH_LIGHTS": {
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



