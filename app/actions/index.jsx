import {WorldActionTypes, LightActionTypes, EntityActionTypes, ItemActionTypes } from "../actiontypes/index.jsx";


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
const addEntities = (entities, floor) => ({
	type: EntityActionTypes.ADD_ENTITIES,
	entities,
	floor
})

const moveEntities = (entities) => ({
	type: EntityActionTypes.MOVE_ENTITIES,
	entities
})

//ItemActionCreators
const addItems = (items) => ({
	type: ItemActionTypes.ADD_ITEMS,
	items
})



const WorldActionCreators = {createWorld};
const LightActionCreators = {switchLights};
const EntityActionCreators = {addEntities, moveEntities};
const ItemActionCreators = {addItems};

export {
	WorldActionCreators, 
	LightActionCreators,
	EntityActionCreators,
	ItemActionCreators
};




