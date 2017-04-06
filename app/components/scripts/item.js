class Item {
	constructor(properties) {
		this.x;
		this.y;
		this.name = properties["name"] || "";
	}

	get coords() {
		return [this.x, this.y];
	}

	set coords(coordinates) {
		this.x = coordinates[0];
		this.y = coordinates[1];
	}
}


const saberTemplate = {
	name: "LightSaber"
}

export {Item, saberTemplate};