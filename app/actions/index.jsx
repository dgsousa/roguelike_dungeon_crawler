import { playerTemplate, enemyTemplate, bossTemplate } from "../scripts/entities.js";
import { foodTemplate, weaponTemplate } from "../scripts/items.js";
import World from "../scripts/world.js";


//ActionCreators
const createWorld = (world) => ({ type: "CREATE_WORLD", world });

const switchLights = () => ({ type: "SWITCH_LIGHTS" });

const goUpstairs = (coords) => ({ type: "GO_UPSTAIRS", coords });

const gameOver = (gameEnd) => ({ type: "GAME_OVER", gameEnd });

const createEntity = (entity) => ({ type: "CREATE_ENTITY", entity });

const moveEntity = (coords, index) => ({ type: "MOVE_ENTITY", coords, index });

const updateMessage = (message) => ({ type: "UPDATE_MESSAGE", message });

const damageEntity = (index, damage) => ({ type: "DAMAGE_ENTITY", index, damage });

const removeEntity = (index) => ({ type: "REMOVE_ENTITY", index });

const increaseExperience = (experience) => ({ type: "INCREASE_EXPERIENCE", experience });

const increaseLevel = () => ({ type: "INCREASE_LEVEL"});

const updateWeaponOrHealth = (index) => ({ type: "UPDATE_WEAPON_OR_HEALTH", index });

const restart = () => (dispatch, getState) => {
	const { width, height, depth } = getState();
	const world = new World(width, height, depth);
	dispatch(createWorld(world));
	dispatch(setupFloor());
};

const setupFloor = () => (dispatch) => {
	dispatch(generateEntities());
	dispatch(updateMessage(["Welcome to the Dungeon!"]));
};

const scrollScreen = (e) => {
	e.preventDefault();
	const [x, y] = getDirection(e);

	return function(dispatch, getState) {
		const {width, height, entities, floor} = getState();
		const player = entities[0];
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
		const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		const playerCoords = [playerX, playerY];
		const entityIndex = entityAt(playerCoords, getState());
		
		if(entityIndex && isEnemy(entities, entityIndex)) {
			dispatch(encounterEnemy(entityIndex));
		
		} else if(entityIndex && isItem(entities, entityIndex, floor)) {
			dispatch(encounterItem(entityIndex));
		
		} else if(isStaircase(playerCoords, getState())) {
			dispatch(nextFloor(playerCoords));
		
		} else if(isEmptySquare(playerCoords, getState()) && !entityIndex) {
			dispatch(move(playerCoords));
		} 
		dispatch(gameOver(checkGameStatus(getState())));
	};
};



const move = (playerCoords) => (dispatch, getState) => {
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
};
		

const nextFloor = (playerCoords) => (dispatch, getState) => {
	const { floor } = getState();
	dispatch(goUpstairs(playerCoords));
	dispatch(generateEntities());
	dispatch(updateMessage([`You have entered floor ${floor + 1}`]));
};



const encounterEnemy = (entityIndex) => (dispatch, getState) => {
	const { entities } = getState();
	const player = entities[0];
	const damageToEntity = getDamage(player, entities[entityIndex]);
	const damageToPlayer = getDamage(entities[entityIndex], player);
	const experience = entities[entityIndex]._experience;
	
	if(damageToEntity < entities[entityIndex]._hp) {
		dispatch(damageEntity(entityIndex, damageToEntity));
		dispatch(damageEntity(0, damageToPlayer));
		dispatch(updateMessage([`You attacked the ${entities[entityIndex]._type} for ${damageToEntity} damage`,`You were attacked by the ${entities[entityIndex]._type} for ${damageToPlayer} damage`]));
	} else if(damageToEntity >= entities[entityIndex]._hp) {
		dispatch(removeEntity(entityIndex));
		dispatch(increaseExperience(experience));
		dispatch(levelUp());
		dispatch(updateMessage([`You defeated the ${entities[entityIndex]._type}`]));
	}	
	
};

const encounterItem = (entityIndex) => (dispatch, getState) => {
	const { entities } = getState();
	dispatch(updateWeaponOrHealth(entityIndex));
	dispatch(removeEntity(entityIndex));
	dispatch(updateMessage([`You picked up a ${entities[entityIndex]._type}!`]));
};

const levelUp = () => (dispatch, getState) => {
	const {entities: [player]} = getState();
	const sumRange = (min, max) => min !== max ? sumRange(min, max - 1) + max : 0;
	if(player._experience >= (sumRange(0, player._level)) * 100) dispatch(increaseLevel());
};

const generateEntities = () => (dispatch, getState) => {
	const {floor, entities} = getState();
	const templateMenu = [[enemyTemplate, 10], [foodTemplate, 5], [weaponTemplate, 1]];
	if(floor === 0) dispatch(createEntity({...playerTemplate, coords: emptyCoords(entities, getState())}));
	if(floor === 3) dispatch(createEntity({...bossTemplate, coords: emptyCoords(entities, getState())}));
	templateMenu.forEach((template) => {
		for(let i = 0; i < template[1]; i++) {
			dispatch(createEntity({...template[0](floor), coords: emptyCoords(entities, getState())}));
		}
	});
};


//Helper Functions
const isStaircase = ([x, y], state) => {
	const { world, floor } = state;
	return world._regions[floor][x][y] == 5;
};

const isWall = ([x, y], state) => {
	const { world, floor } = state;
	return world._regions[floor][x][y] == 0;
};

const isEmptySquare = ([x, y], state) => {
	return 	inBounds([x, y], state) && !isWall([x, y], state) && !isStaircase([x, y], state);
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
	} while (!isEmptySquare([x, y], state) && entityAt([x, y], state) === null);
	return [x, y];
};


const entityAt = ([x, y], state) => {
	const { entities } = state;
	for(let i = 0; i < entities.length; i++) {
		if(entities[i].coords[0] === x && entities[i].coords[1] === y) return i;
	}
	return null;
};

const isEnemy = (entities, index) => entities[index]._type === "alien" || entities[index]._type === "clown";

const isItem = (entities, index, floor) => 
	entities[index]._type == weaponTemplate(floor)._type || 
		entities[index]._type == foodTemplate(floor)._type;


const getDamage = (entity1, entity2) => {
	return (1 + Math.floor(Math.random() * Math.max(0, entity1._attackValue - entity2._defenseValue)));
};

const getNewCoords = (coords, state) => {
	const xOffset = Math.floor(Math.random() * 3) - 1;
	const yOffset = Math.floor(Math.random() * 3) - 1;
	const newCoords = [coords[0] + xOffset, coords[1] + yOffset];
	return 	isEmptySquare(newCoords, state) && entityAt(newCoords, state) === null ? newCoords : coords;		
};


const checkGameStatus = (state) => {
	const {entities: [player]} = state;
	return 	player._hp <= 0 ? "You Lose!" : 
			player._experience > 1000 ? "You Win!" : "";
};


const getDirection = (e) => {
	const keyMap = {
		[73]: [0, -1],
		[87]: [0, -1],
		[77]: [0, 1],
		[88]: [0, 1],
		[65]: [-1, 0],
		[74]: [-1, 0],
		[75]: [1, 0],
		[68]: [1, 0],
		[81]: [-1, -1],
		[69]: [1, -1],
		[90]: [-1, 1],
		[67]: [1, 1]
	};
	return 	keyMap[e.keyCode] || [0, 0];
};



export { createWorld, setupFloor, scrollScreen, switchLights, restart };




