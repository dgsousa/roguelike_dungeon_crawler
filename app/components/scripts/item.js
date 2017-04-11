class Item {
	constructor(properties) {
		this.x;
		this.y;
		for(let key in properties) {
			this[key] = properties[key];
		}
	}
}


const foodTemplate = (num) => {
	return {	
		name: "food",
		type: "food",
		_hp: 10 * num
	}
};

const weaponTemplate = (num) => {
	return {
		name: "weapon",
		type: "weapon",
		_attackValue: 10 * num
	}
};


export {Item, foodTemplate, weaponTemplate};