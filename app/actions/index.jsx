import {WorldActionTypes, LightActionTypes, EntityActionTypes } from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})

//LightActionCreators
const switchLights = () => ({
	type: LightActionTypes.SWITCH_LIGHTS
})

//EntityActionCreators
const addEntitiesAndItems = (entities, items, floor) => ({
	type: EntityActionTypes.ADD_ENTITIES_AND_ITEMS,
	entities,
	items,
	floor
})

const moveEntities = (entities) => ({
	type: EntityActionTypes.MOVE_ENTITIES,
	entities
})





const WorldActionCreators = {createWorld};
const LightActionCreators = {switchLights};
const EntityActionCreators = {addEntitiesAndItems, moveEntities};


export {
	WorldActionCreators, 
	LightActionCreators,
	EntityActionCreators
};




