import { playerTemplate} from "../scripts/entities.js";
import * as ROT from "../../bower_components/rot.js/rot.js";




//ActionCreators
const createWorld = (world) => ({
	type: "CREATE_WORLD",
	world
});

const fillFloor = (player, occupiedSquares) => ({
	type: "FILL_FLOOR",
	player,
	occupiedSquares
});


const setupFloor = () => {
	return function(dispatch, getState) {
		const player = {...playerTemplate, coords: emptyCoords([], getState())};
		const occupiedSquares = {
			[`${player.coords[0]}x${player.coords[1]}`]: player._type
		};
		dispatch(fillFloor(player, occupiedSquares));
	};
};

const scroll = (e) => {
	return function(dispatch) {
		e.preventDefault();
		const coords = 	e.keyCode === ROT.VK_I ?	[0, -1]	:
						e.keyCode === ROT.VK_M ?	[0, 1]	:
						e.keyCode === ROT.VK_J ?	[-1, 0]	:
						e.keyCode === ROT.VK_K ?	[1, 0]	: false;
		if(coords !== false) dispatch(scrollScreen(coords));
	};
};


const scrollScreen = ([x, y]) => {
	return function(dispatch, getState) {
		const {width, height, player} = getState();
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
		const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		const playerCoords = [playerX, playerY];
		
		dispatch(move(playerCoords));
	};
};



const move = (playerCoords) => {
	return function(dispatch, getState) {
		if(isEmptySquare(playerCoords, getState())) {
			const player = Object.assign(getState().player, {coords: playerCoords});
			const occupiedSquares = {
				[`${player.coords[0]}x${player.coords[1]}`]: player._type
			};
			dispatch({
				type: "MOVE",
				player, 
				occupiedSquares
			});
			return true;
		}
		return false;
	};
};

const nextFloor = (playerCoords) => {
	return function(dispatch, getState) {
		if(this.isStaircase(playerCoords, getState())) {
			const player = Object.assign(getState().player, {coords: playerCoords});
			const occupiedSquares = {
				[`${player.coords[0]}x${player.coords[1]}`]: player._type
			};
			dispatch(fillFloor(player, occupiedSquares));
			return true;
		}
		return false;
	};	
};






// const switchLights = () => ({
// 	type: "SWITCH_LIGHTS"
// });




// const fight = (entities, message, gameEnd, occupiedSquares) => ({
// 	type: "FIGHT",
// 	entities,
// 	message,
// 	gameEnd,
// 	occupiedSquares
// });



//helper functions


const isStaircase = ([x, y], state) => {
	const { world, floor } = state;
	return world._regions[floor][x][y] == 5;
};

const isEmptySquare = ([x, y], state) => {
	const { world, floor } = state;
	return inBounds([x, y], state) && world._regions[floor][x][y] && !isStaircase([x, y], state);
};

const inBounds = ([x, y], state) => {
	const {width, height} = state;
	return x >= 0 && x < width && y >= 0 && y < height;
};

const emptyCoords = (entities, state) => {
	const {width, height} = state;
	let x, y;
	do {
		x = Math.floor(Math.random() * width);
		y = Math.floor(Math.random() * height);
	} while (!isEmptySquare([x, y], state));
	return [x, y];
};

// getOccupiedSquares(entities) {
// 	const occupiedSquares = {};
// 	entities.forEach((entity) => {
// 		occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type;
// 	});
// 	return occupiedSquares;
// }








const ActionCreators = {createWorld, setupFloor, scroll};



export default ActionCreators;




