
export default class Entity {
	constructor(properties) {
		this.coords = null;
		for(let key in properties) {
			this[key] = properties[key];
		}
	}

	attack(opponent) {
		const attack = this._attackValue;
		const defense = entity._defenseValue;
		const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
		opponent.takeDamage(this, damage);
	}

	takeDamage(attacker, damage) {
		this._hp -= damage;
		if(this._hp > 0) this.attack(attacker);			
	}

	act() {
		return;
	}
}







