import {WorldActionTypes, PlayerActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})

//PlayerActionCreators
const goUpstairs = (entities, prevCoords) => ({
	type: PlayerActionTypes.GO_UPSTAIRS,
	entities
})

//LightActionCreators
const switchLights = () => ({
	type: LightActionTypes.SWITCH_LIGHTS
})

//EntityActionCreators
const addEntities = (entities) => ({
	type: EntityActionTypes.ADD_ENTITIES,
	entities
})

const moveEntities = (entities) => ({
	type: EntityActionTypes.MOVE_ENTITIES,
	entities
})


const WorldActionCreators = {createWorld};
const PlayerActionCreators = { goUpstairs};
const LightActionCreators = {switchLights};
const EntityActionCreators = {addEntities, moveEntities};

export {
	WorldActionCreators, 
	PlayerActionCreators,
	LightActionCreators,
	EntityActionCreators
};




