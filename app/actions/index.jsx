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


const WorldActionCreators = {createWorld};
const PlayerActionCreators = {addPlayer};

export {WorldActionCreators, PlayerActionCreators};
