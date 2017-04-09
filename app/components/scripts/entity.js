
export default class Entity {
	constructor(properties) {
		this.x;
		this.y;
		for(let key in properties) {
			this[key] = properties[key];
		}
	}

	act() {
		return;
	}

	// attack(entity) {
	// 	const attack = this._attackValue;
	// 	const defense = entity._defenseValue;
	// 	const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
	// 	return entity.takeDamage(this, damage);
	// }

	// takeDamage(attacker, damage) {
	// 	this._hp -= damage;
	// 	if(this._hp > 0) {
	// 		const message = this.attack(attacker);
	// 		return [`You attacked the ${this._name} for ${damage} damage.`, `${message}`]
	// 	} else if(this._hp <= 0) {
	// 		attacker._experience += this._experience;
	// 		attacker.levelUp();
	// 		return [`You defeated the ${this._name}.`]
	// 	} 
						
	// }

	get coords() {
		return [this.x, this.y];
	}

	set coords(coordinates) {
		this.x = coordinates[0];
		this.y = coordinates[1];
	}

}







