
//ActionCreators
const createWorld = (world) => ({
	type: "CREATE_WORLD",
	world
});

const fillFloor = (player, floor, occupiedSquares) => ({
	type: "FILL_FLOOR",
	player,
	floor,
	occupiedSquares
});


// const switchLights = () => ({
// 	type: "SWITCH_LIGHTS"
// });


// const moveEntities = (entities, items, message, occupiedSquares) => ({
// 	type: "MOVE_ENTITIES",
// 	entities,
// 	items,
// 	message,
// 	occupiedSquares
// });

// const fight = (entities, message, gameEnd, occupiedSquares) => ({
// 	type: "FIGHT",
// 	entities,
// 	message,
// 	gameEnd,
// 	occupiedSquares
// });







const ActionCreators = {createWorld, fillFloor, switchLights, moveEntities, fight};



export default ActionCreators;




