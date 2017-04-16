import {WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})

//PlayerActionCreators
const movePlayer = (player, prevCoords) => ({
	type: PlayerActionTypes.MOVE_PLAYER,
	player,
	prevCoords
})


const goUpstairs = (entities, prevCoords) => ({
	type: PlayerActionTypes.GO_UPSTAIRS,
	entities
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
const PlayerActionCreators = { movePlayer, goUpstairs};
const LightActionCreators = {switchLights};
const EntityActionCreators = {addEntities};

export {
	WorldActionCreators, 
	PlayerActionCreators,
	LightActionCreators,
	EntityActionCreators
};




