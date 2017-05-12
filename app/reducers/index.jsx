


const Reducer = (state = {}, action) => {
	switch(action.type) {
	case "CREATE_WORLD": {
		return  {
			...state,
			world: action.world,
			gameEnd: false,
			floor: 0
		};
	}

	case "CREATE_ENTITY": {
		return {
			...state,
			entities: [...state.entities, action.entity],
			occupiedSquares: {
				...state.occupiedSquares,
				[`${action.entity.coords[0]}x${action.entity.coords[1]}`]: action.entity._type 
			}
		};
	}

	case "MOVE_ENTITY": {
		return {
			...state,
			entities: [	
				...state.entities.slice(0, action.index), 
				{ 
					...state.entities[action.index], coords: action.coords
				}, 
				...state.entities.slice(action.index + 1)
			],
			occupiedSquares: {
				...state.occupiedSquares,
				[`${state.entities[action.index].coords[0]}x${state.entities[action.index].coords[1]}`]: false,
				[`${action.coords[0]}x${action.coords[1]}`]: state.entities[action.index]._type
			}
		};
	}

	case "UPDATE_MESSAGE": {
		return {
			...state,
			message: action.message
		};
	}

	case "GO_UPSTAIRS": {
		return {
			...state,
			entities: [{...state.entities[0], coords: action.coords}],
			occupiedSquares: {
				[`${action.coords[0]}x${action.coords[1]}`]: state.entities[0]._type
			},
			floor: state.floor + 1
		};
	}

	case "SWITCH_LIGHTS": {
		return {
			...state,
			lightsOn: !state.lightsOn
		};
	}

	case "GAME_OVER": {
		return {
			...state,
			gameEnd: action.gameEnd
		};
	}

	case "DAMAGE_ENTITY": {
		return {
			...state,
			entities: [
				...state.entities.slice(0, action.index),
				{
					...state.entities[action.index], _hp: state.entities[action.index]._hp - action.damage
				},
				...state.entities.slice(action.index + 1)
			]
		};
	}

	case "REMOVE_ENTITY": {
		return {
			...state,
			entities: [
				...state.entities.slice(0, action.index),
				...state.entities.slice(action.index + 1)
			],
			occupiedSquares: {
				...state.occupiedSquares,
				[`${state.entities[action.index].coords[0]}x${state.entities[action.index].coords[1]}`]: false
			}
		};
	}

	case "INCREASE_EXPERIENCE": {
		return {
			...state,
			entities: [
				{
					...state.entities[0], _experience: state.entities[0]._experience + action.experience
				},
				...state.entities.slice(1)
			]
		};
	}

	case "INCREASE_LEVEL": {
		return {
			...state,
			entities: [
				{
					...state.entities[0], 
					_attackValue: state.entities[0]._attackValue + state.entities[0]._level * 10,
					_defenseValue: state.entities[0]._defenseValue + state.entities[0]._level * 5,
					_hp: state.entities[0]._hp + state.entities[0]._level * 20,
					_level: state.entities[0]._level + 1
				},
				...state.entities.slice(1)
			]
		};
	}

	case "UPDATE_WEAPON_OR_HEALTH": {
		return {
			...state,
			entities: [
				{
					...state.entities[0],
					_weapon: state.entities[action.index]._weapon || state.entities[0]._weapon,
					_attackValue: state.entities[0]._attackValue + state.entities[action.index]._attackValue || state.entities[0]._attackValue,
					_hp: state.entities[0]._hp + state.entities[action.index]._hp || state.entities[0]._hp
				},
				...state.entities.slice(1)
			]
		};
	}


	default:
		return state;
	}
};




export default Reducer;



