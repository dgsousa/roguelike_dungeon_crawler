import { playerTemplate, enemyTemplate, bossTemplate } from "../scripts/entities.js";
import { foodTemplate, weaponTemplate } from "../scripts/items.js";
import World from "../scripts/world.js";
import * as ROT from "../../bower_components/rot.js/rot.js";


//ActionCreators
const createWorld = (world) => ({
	type: "CREATE_WORLD",
	world
});

const fillFloor = (entities, occupiedSquares, message) => ({
	type: "FILL_FLOOR",
	entities,
	occupiedSquares,
	message
});

const goUpstairs = (coords) => ({
	type: "GO_UPSTAIRS",
	coords
});

const gameOver = (gameEnd) => ({
	type: "GAME_OVER",
	gameEnd
});


const createEntity = (entity) => ({
	type: "CREATE_ENTITY",
	entity
});

const moveEntity = (coords, index) => ({
	type: "MOVE_ENTITY",
	coords,
	index
});

const updateMessage = (message) => ({
	type: "UPDATE_MESSAGE",
	message
});

const damageEntity = (damage) => ({

})

const restart = () => {
	return function(dispatch, getState) {
		const { width, height, depth } = getState();
		const world = new World(width, height, depth);
		dispatch(createWorld(world));
		dispatch(setupFloor());
	};
};

const setupFloor = () => {
	return function(dispatch) {
		dispatch(generateEntities());
		dispatch(updateMessage(["Welcome to the Dungeon!"]));
	};
};

const scroll = (e) => {
	return function(dispatch) {
		e.preventDefault();
		const coords = 	e.keyCode === ROT.VK_W || e.keyCode === ROT.VK_UP	?	[0, -1]	:
						e.keyCode === ROT.VK_S || e.keyCode === ROT.VK_DOWN ?	[0, 1]	:
						e.keyCode === ROT.VK_A || e.keyCode === ROT.VK_LEFT ?	[-1, 0]	:
						e.keyCode === ROT.VK_D || e.keyCode === ROT.VK_RIGHT?	[1, 0]	:
						e.keyCode === ROT.VK_Q ?	[-1, -1]:
						e.keyCode === ROT.VK_E ?	[1, -1] :
						e.keyCode === ROT.VK_Z ?	[-1, 1] :
						e.keyCode === ROT.VK_X ?	[1, 1]	: false;
		if(coords) dispatch(scrollScreen(coords));
	};
};


const scrollScreen = ([x, y]) => {
	return function(dispatch, getState) {
		const {width, height, entities: [player]} = getState();
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
		const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		const playerCoords = [playerX, playerY];
		
		dispatch(move(playerCoords)) 				||
		dispatch(nextFloor(playerCoords))			||
		dispatch(encounterEntity(playerCoords));
		// dispatch(gameOver(checkGameStatus(getState())));
	};
};



const move = (playerCoords) => {
	return function(dispatch, getState) {
		if(isEmptySquare(playerCoords, getState())) {
			const { entities } = getState();
			entities.forEach((entity, index) => {
				if(entity._type === playerTemplate._type) {
					dispatch(moveEntity(playerCoords, index));
				} else if(entity._type === enemyTemplate()._type) {
					const newCoords = getNewCoords(entity.coords, getState());
					dispatch(moveEntity(newCoords, index));
				}
			});
			dispatch(updateMessage([""]));
			return true;
		}
		return false;
	};
};

const getNewCoords = (coords, state) => {
	const xOffset = Math.floor(Math.random() * 3) - 1;
	const yOffset = Math.floor(Math.random() * 3) - 1;
	const newCoords = [coords[0] + xOffset, coords[1] + yOffset];
	return 	isEmptySquare(newCoords, state) && !(newCoords[0] == coords[0] && newCoords[1] == coords[1]) ?
				newCoords : coords;
};

const nextFloor = (playerCoords) => {
	return function(dispatch, getState) {
		if(isStaircase(playerCoords, getState())) {
			const { floor } = getState();
			dispatch(goUpstairs(playerCoords));
			dispatch(generateEntities());
			dispatch(updateMessage([`You have entered floor ${floor + 1}`]));
			return true;
		}
		return false;
	};	
};

const encounterEntity = (playerCoords) => {
	return function(dispatch, getState) {
		const entity = entityAt(playerCoords, getState());
		const { floor, entities: [player, ...entities] } = getState();
		if(entity) {
			if(entity._type == enemyTemplate(floor)._type || entity._type == bossTemplate._type) {
				const damageToEntity = getDamage(player, entity);
				const damageToPlayer = getDamage(entity, player);
				dispatch(damageEntity(entity));
				//dispatch(damagePlayer(player));
				// const { newEntities, message } = fightEnemy(player, entity, entities);
				// const occupiedSquares = getOccupiedSquares(newEntities);
				// dispatch(fillFloor(newEntities, occupiedSquares, message));
			
			} else if(entity._type == weaponTemplate(floor)._type || entity._type == foodTemplate(floor)._type) {
				const { newEntities, message } = pickUpItem(player, entity, entities);
				const occupiedSquares = getOccupiedSquares(newEntities);
				dispatch(fillFloor(newEntities, occupiedSquares, message));
			}
			return true;
		}
		return false;
	};
};


const switchLights = () => ({
	type: "SWITCH_LIGHTS"
});




//Helper Functions
const isStaircase = ([x, y], state) => {
	const { world, floor } = state;
	return world._regions[floor][x][y] == 5;
};

const isEmptySquare = ([x, y], state) => {
	const { world, floor } = state;
	return 	inBounds([x, y], state) && 
			world._regions[floor][x][y] && 
			!isStaircase([x, y], state) &&
			!entityAt([x, y], state);
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


const generateEntities = () => {
	return function(dispatch, getState) {
		const {floor, entities} = getState();
		if(floor === 0) dispatch(createEntity({...playerTemplate, coords: emptyCoords(entities, getState())}));
		templateMenu.forEach((template) => {
			for(let i = 0; i < template[1]; i++) {
				dispatch(createEntity({...template[0](floor), coords: emptyCoords(entities, getState())}));
			}
		});
		if(floor === 3) dispatch(createEntity({...bossTemplate, coords: emptyCoords(entities, getState())}));
	};
};

const entityAt = ([x, y], state) => {
	const { entities } = state;
	if(entities) {
		for(let i = 0; i < entities.length; i++) {
			if(entities[i].coords[0] === x && entities[i].coords[1] === y) {
				return { ...entities[i] };
			}
		}
	}
	return false;
};


const templateMenu = [
	[enemyTemplate, 10],
	[foodTemplate, 5],
	[weaponTemplate, 1]
];


const getOccupiedSquares = (entities) => {
	const occupiedSquares = {};
	entities.forEach((entity) => {
		occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type;
	});
	return occupiedSquares;
};

const moveEntities = (playerCoords, state) => {
	const { entities } = state;
	const enemyType = enemyTemplate()._type;
	return entities.map((entity) => {
		if(entity._type !== enemyType) return entity;
		else {
			const xOffset = Math.floor(Math.random() * 3) - 1;
			const yOffset = Math.floor(Math.random() * 3) - 1;
			const coords = [entity.coords[0] + xOffset, entity.coords[1] + yOffset];
			return 	isEmptySquare(coords, state) && !(coords[0] == playerCoords[0] && coords[1] == playerCoords[1]) ?
						{...entity, coords: coords} : 
						entity;
		}
	});
};

const pickUpItem = (player, entity, entities) => { 
	const newEntities = [];
	const message = [`You picked a ${entity._type}`];
	const newPlayer = {
		...player,
		_hp: player._hp + (entity._hp || 0),
		_weapon: entity._weapon || player._weapon,
		_attackValue: player._attackValue + (entity._attackValue || 0),
	};
	newEntities.push(newPlayer);
	entities.forEach((member) => {
		if(entity.coords[0] != member.coords[0] || entity.coords[1] != member.coords[1]) {
			newEntities.push({...member});
		}
	});
	return { newEntities, message };
};

// const fightEnemy = (player, entity, entities) => {
// 	const damage1 = getDamage(player, entity);
// 	const damage2 = getDamage(entity, player);
	
// 	const enemy = {
// 		...entity,
// 		_hp: entity._hp - damage1
// 	};
	
// 	const newPlayer = {
// 		...player,
// 		_hp: enemy._hp > 0 ? (player._hp - damage2) : player._hp,
// 		_experience: enemy._hp > 0 ? player._experience : player._experience + enemy._experience
// 	};
	
// 	newPlayer.levelUp();
// 	newEntities.push(newPlayer);
	

// 	return { newEntities, message };
// };


const getDamage = (entity1, entity2) => {
	return (1 + Math.floor(Math.random() * Math.max(0, entity1._attackValue - entity2._defenseValue)));
};

const getAttackMessage = (player, enemy, enemyDamage, playerDamage) => {
	return 	player._hp < 0 ? 
				[`You were defeated by the ${enemy._type}`] :
				enemy._hp < 0 ?	
					[`You attacked the ${enemy._type} for ${enemyDamage} damage`, `You defeated the ${enemy._type}`] :
					[`You attacked the ${enemy._type} for ${enemyDamage} damage`, `You were attacked by the ${enemy._type} for ${playerDamage} damage`]; 
};

const checkGameStatus = (state) => {
	const {entities: [player]} = state;
	return 	player._hp <= 0 ? "You Lose!" : 
			player._experience > 1000 ? "You Win!" : "";
};



export { createWorld, setupFloor, scroll, switchLights, restart };




