import {WorldActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})

const fillFloor = (entities, items, floor, message) => ({
	type: WorldActionTypes.FILL_FLOOR,
	entities,
	items, 
	floor,
	message
})

//LightActionCreators
const switchLights = () => ({
	type: LightActionTypes.SWITCH_LIGHTS
})

//EntityActionCreators

const moveEntities = (entities, message) => ({
	type: EntityActionTypes.MOVE_ENTITIES,
	entities,
	message
})


const WorldActionCreators = {createWorld, fillFloor};
const LightActionCreators = {switchLights};
const EntityActionCreators = {moveEntities};


export {
	WorldActionCreators, 
	LightActionCreators,
	EntityActionCreators
};




