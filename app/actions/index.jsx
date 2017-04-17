
//ActionCreators
const createWorld = (world) => ({
	type: "CREATE_WORLD",
	world
})

const fillFloor = (entities, items, floor, message) => ({
	type: "FILL_FLOOR",
	entities,
	items, 
	floor,
	message
})


const switchLights = () => ({
	type: "SWITCH_LIGHTS"
})



const moveEntities = (entities, items, message) => ({
	type: "MOVE_ENTITIES",
	entities,
	items,
	message
})

const fight = (entities, message, gameEnd) => ({
	type: "FIGHT",
	entities,
	message,
	gameEnd
})



const ActionCreators = {createWorld, fillFloor, switchLights, moveEntities, fight};



export default ActionCreators




