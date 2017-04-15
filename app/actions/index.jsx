import {WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})


//PlayerActionCreators
const addPlayer = (player) => ({
	type: PlayerActionTypes.ADD_PLAYER,
	player
})

const movePlayer = (player, prevCoords) => ({
	type: PlayerActionTypes.MOVE_PLAYER,
	player,
	prevCoords
})


const goUpstairs = (player, prevCoords) => ({
	type: PlayerActionTypes.GO_UPSTAIRS,
	player,
	prevCoords
})

//LightActionCreators
const switchLights = () => ({
	type: LightActionTypes.SWITCH_LIGHTS,
})

const addEntities = (entities) => ({
	type: EntityActionTypes.ADD_ENTITIES,
	entities
})



const WorldActionCreators = {createWorld};
const PlayerActionCreators = {addPlayer, movePlayer, goUpstairs};
const LightActionCreators = {switchLights};
const EntityActionCreators = {addEntities};

export {
	WorldActionCreators, 
	PlayerActionCreators,
	LightActionCreators,
	EntityActionCreators
};




