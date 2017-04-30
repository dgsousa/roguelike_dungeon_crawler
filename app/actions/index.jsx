import { playerTemplate, enemyTemplate, bossTemplate } from "../scripts/entities.js";
import { foodTemplate, weaponTemplate } from "../scripts/items.js";

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

const goUpstairs = () => ({
	type: "GO_UPSTAIRS"
});


const setupFloor = () => {
	return function(dispatch, getState) {
		const entities = generateEntities(getState());
		const occupiedSquares = getOccupiedSquares(entities);
		const message = ["Welcome to the the Dungeon!"];
		dispatch(fillFloor(entities, occupiedSquares, message));
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
		const {width, height, entities: [player]} = getState();
		const playerX = Math.max(0, Math.min(width - 1, player.coords[0] + x));
		const playerY = Math.max(0, Math.min(height - 1, player.coords[1] + y));
		const playerCoords = [playerX, playerY];
		
		dispatch(move(playerCoords)) 			||
		dispatch(nextFloor(playerCoords))		||
		dispatch(encounterEntity(playerCoords));
	};
};



const move = (playerCoords) => {
	return function(dispatch, getState) {
		if(isEmptySquare(playerCoords, getState())) {
			const {entities: [player]} = getState();
			const newPlayer = {...player, coords: playerCoords};
			const newEntities = [newPlayer, ...moveEntities(playerCoords, getState()).slice(1)];
			const occupiedSquares = getOccupiedSquares(newEntities);
			dispatch(fillFloor(newEntities, occupiedSquares, [""]));
			return true;
		}
		return false;
	};
};

const nextFloor = (playerCoords) => {
	return function(dispatch, getState) {
		if(isStaircase(playerCoords, getState())) {
			const { entities: [player] } = getState();
			let newPlayer, newEntities, occupiedSquares, message;
			dispatch(goUpstairs());
			newPlayer = {...player, coords: playerCoords};
			newEntities = [newPlayer, ...generateEntities(getState()).slice(1)];
			occupiedSquares = getOccupiedSquares(newEntities);
			message = [`You have entered floor ${getState().floor + 1}`];
			dispatch(fillFloor(newEntities, occupiedSquares, message));
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
				const { newEntities, message } = fightEnemy(player, entity, entities);
				const occupiedSquares = getOccupiedSquares(newEntities);
				dispatch(fillFloor(newEntities, occupiedSquares, message));
			} else if(entity._type == weaponTemplate(floor)._type || entity._type == foodTemplate(floor)._type) {
				const { newEntities, message } = pickUpItem(player, entity, entities);
				const occupiedSquares = getOccupiedSquares(newEntities);
				dispatch(fillFloor(newEntities, occupiedSquares, message));
			}
		}
	};
};


const switchLights = () => ({
	type: "SWITCH_LIGHTS"
});


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


const generateEntities = (state) => {
	const entities = [];
	const {floor} = state;
	entities.push({...playerTemplate, coords: emptyCoords(entities, state)});
	templateMenu.forEach((template) => {
		for(let i = 0; i < template[1]; i++) {
			entities.push({...template[0](floor), coords: emptyCoords(entities, state)});
		}
	});
	if(floor === 3) entities.push({...bossTemplate, coords: emptyCoords(entities, state)});
	return entities;
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

const fightEnemy = (player, entity, entities) => {
	const newEntities = [];
	const damage1 = getDamage(player, entity);
	const damage2 = getDamage(entity, player);
	
	const enemy = {
		...entity,
		_hp: entity._hp - damage1
	};
	
	const newPlayer = {
		...player,
		_hp: enemy._hp > 0 ? (player._hp - damage2) : player._hp,
		_experience: enemy._hp > 0 ? player._experience : player._experience + enemy._experience
	};
	
	const message = getAttackMessage(newPlayer, enemy, damage1, damage2);
	newPlayer.levelUp();
	newEntities.push(newPlayer);
	
	entities.forEach((member) => {
		if(enemy.coords[0] !== member.coords[0] || enemy.coords[1] !== member.coords[1]) {
			newEntities.push(member);
		} else if(enemy._hp > 0) {
			newEntities.push(enemy);
		}
	});

	return { newEntities, message };
};


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





const ActionCreators = {createWorld, setupFloor, scroll, switchLights};



export default ActionCreators;




