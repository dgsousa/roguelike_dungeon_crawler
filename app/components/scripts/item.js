class Item {
	constructor(properties) {
		this.x;
		this.y;
		for(let key in properties) {
			this[key] = properties[key];
		}
	}
}

const weaponTypes = {
	"1": "Rock",
	"2": "Sword",
	"3": "Axe",
	"4": "Bomb"
}

const foodTypes = {
	"1": "Burger",
	"2": "Mushroom",
	"3": "Pancake",
	"4": "Watermelon"
}

const foodTemplate = (num) => {
	return {	
		type: foodTypes[num],
		_hp: 10 * num
	}
};

const weaponTemplate = (num) => {
	return {
		type: weaponTypes[num],
		weapon: weaponTypes[num],
		_attackValue: 10 * num
	}
};


export {Item, foodTemplate, weaponTemplate};