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
		_type: foodTypes[num + 1],
		_hp: 10 * (num + 1)
	}
};

const weaponTemplate = (num) => {
	return {
		_type: weaponTypes[num + 1],
		_weapon: weaponTypes[num + 1],
		_attackValue: 10 * (num + 1)
	}
};


export {Item, foodTemplate, weaponTemplate};