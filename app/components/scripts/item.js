class Item {
	constructor(properties) {
		this.x;
		this.y;
		this.name = properties["name"] || "";
		this.type = properties["type"] || "";
		this._attackValue = properties["attackValue"] || 0;
		this._hp = properties["hp"] || 0;
	}
}


const foodTemplate = (num) => {
	return {	
		name: "food",
		type: "food",
		hp: 10 * num
	}
};

const weaponTemplate = (num) => {
	return {
		name: "weapon",
		type: "weapon",
		attackValue: 10 * num
	}
};


export {Item, foodTemplate, weaponTemplate};