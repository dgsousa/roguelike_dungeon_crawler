import { combineReducers } from "redux";


const world = (state = [], action) => {
	switch(action.type) {
	case "CREATE_WORLD": 
		return action.world;

	default:
		return state;
	}
};


const floor = (state = 0, action) => {
	switch(action.type) {
	case "CREATE_WORLD": 
		return 0;

	case "GO_UPSTAIRS": 
		return state + 1;

	default:
		return state;
	}
};


const entities = (state = [], action) => {
	switch(action.type) {
	case "CREATE_ENTITY": 
		return [
			...state,
			action.entity
		];

	case "MOVE_ENTITY": 
		return [
			...state.slice(0, action.index),
			{
				...state[action.index], coords: action.coords
			},
			...state.slice(action.index + 1)
		];

	case "GO_UPSTAIRS": 
		return [
			{
				...state[0],
				coords: action.coords
			}
		];

	case "DAMAGE_ENTITY": 
		return [
			...state.slice(0, action.index),
			{
				...state[action.index], _hp: state[action.index]._hp - action.damage
			},
			...state.slice(action.index + 1)
		];

	case "REMOVE_ENTITY": 
		return [
			...state.slice(0, action.index),
			...state.slice(action.index + 1)
		];

	case "INCREASE_EXPERIENCE": 
		return [
			{
				...state[0], _experience: state[0]._experience + action.experience
			},
			...state.slice(1)
		];

	case "INCREASE_LEVEL": 
		return [
			{
				...state[0], 
				_attackValue: state[0]._attackValue + state[0]._level * 10,
				_defenseValue: state[0]._defenseValue + state[0]._level * 5,
				_hp: state[0]._hp + state[0]._level * 20,
				_level: state[0]._level + 1
			},
			...state.slice(1)
		];

	case "UPDATE_WEAPON_OR_HEALTH": 
		return [
			{
				...state[0],
				_weapon: state[action.index]._weapon || state[0]._weapon,
				_attackValue: state[0]._attackValue + state[action.index]._attackValue || state[0]._attackValue,
				_hp: state[0]._hp + state[action.index]._hp || state[0]._hp
			},
			...state.slice(1)
		];

	default:
		return state;
	}
};

const lightsOn = (state = false, action) => {
	switch(action.type) {
	case "SWITCH_LIGHTS": 
		return !state;

	default:
		return state;
	}
};


const gameEnd = (state = "", action) => {
	switch(action.type) {
	case "CREATE_WORLD": 
		return "";
	

	case "GAME_OVER": 
		return action.gameEnd;
	

	default:
		return state;
	}
};

const message = (state=[], action) => {
	switch(action.type) {
	case "UDPATE_MESSAGE": 
		return action.message;
	

	default:
		return state;
	}
};

const AppReducer = combineReducers({
	width: (state = {}) => state,
	height: (state = {}) => state,
	viewWidth: (state = {}) => state,
	viewHeight: (state = {}) => state,
	depth: (state = {}) => state,
	world,
	floor,
	entities,
	lightsOn,
	gameEnd,
	message,
});



export default AppReducer;



