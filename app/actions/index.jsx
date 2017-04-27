
//ActionCreators
const createWorld = (world) => ({
	type: "CREATE_WORLD",
	world
});

const fillFloor = (entities, items, floor, message, occupiedSquares, itemSquares) => ({
	type: "FILL_FLOOR",
	entities,
	items, 
	floor,
	message,
	occupiedSquares,
	itemSquares
});


const switchLights = () => ({
	type: "SWITCH_LIGHTS"
});


const moveEntities = (entities, items, message, occupiedSquares) => ({
	type: "MOVE_ENTITIES",
	entities,
	items,
	message,
	occupiedSquares
});

const fight = (entities, message, gameEnd, occupiedSquares) => ({
	type: "FIGHT",
	entities,
	message,
	gameEnd,
	occupiedSquares
});

const whateber = (THING) => {
	return (dispatch, getState) => {
		getState.thingThatIneed + 5
		dispatch(fight(state.entities))
	}
}





const ActionCreators = {createWorld, fillFloor, switchLights, moveEntities, fight};



export default ActionCreators;




