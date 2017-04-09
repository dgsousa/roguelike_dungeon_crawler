
export default class Entity {
	constructor(properties) {
		this.x;
		this.y;
		this.attachedMixins = {};
		this.attachedMixinGroups = {};
		const mixins = properties["mixins"] || [];
		for (let i = 0; i < mixins.length; i++) {
			for (let key in mixins[i]) {
				if(key != "name" && key != "init" && !this.hasOwnProperty(key)) {
					this[key] = mixins[i][key];
				}
			}
			this.attachedMixins[mixins[i]["name"]] = true;
			if(mixins[i]["groupName"]) {
				this.attachedMixinGroups[mixins[i]["groupName"]] = true;
			}
			if(mixins[i]["init"]) {
				mixins[i].init.call(this, properties);
			}
		}
	}

	hasMixin(mixin) {
		for(let key in this.attachedMixins) {
			if(key === mixin) {
				return true;
			}
		}
		return false;
	}


	get coords() {
		return [this.x, this.y];
	}

	set coords(coordinates) {
		this.x = coordinates[0];
		this.y = coordinates[1];
	}


	get stats() {
		return {
			attackVaue: this._attackValue,
			defenseValue: this._defenseValue,
			hp: this._hp,
			experience: this._experience
		}
	}

	set stats(object) {
		this._attackValue = object.attackValue || this._attackValue;
		this._defenseValue = object.defenseValue || this._defenseValue;
		this._hp = object.hp || this._hp;
		this._experience = object.experience || this._expeience;
	}
}







