class Item {
	constructor(properties) {
		this.x;
		this.y;
		this.name = properties["name"] || "";
		this.type = properties["type"] || "";
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