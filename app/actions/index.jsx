import {WorldActionTypes, PlayerActionTypes} from "../actiontypes/index.jsx";


//WorldActionCreators
const createWorld = (world) => ({
	type: WorldActionTypes.CREATE_WORLD,
	world
})


//PlayerActionCreators
const addPlayer = (player, coords) => ({
	type: PlayerActionTypes.ADD_PLAYER,
	player,
	coords
})

const movePlayer = (prevCoords, nextCoords) => ({
	type: PlayerActionTypes.MOVE_PLAYER,
	prevCoords,
	nextCoords
})


const goUpstairs = (prevCoords, nextCoords) => ({
	type: PlayerActionTypes.GO_UPSTAIRS,
	prevCoords,
	nextCoords
})


const WorldActionCreators = {createWorld};
const PlayerActionCreators = {addPlayer, movePlayer, goUpstairs};

export {WorldActionCreators, PlayerActionCreators};
