
export const playerTemplate = {
	_name: 'Hero',
	_type: 'hero',
	_attackValue: 20,
	_defenseValue: 10,
	_hp: 100,
	_experience: 0,
	_level: 0

	// takeDamage: (attacker, damage) => {
	// 	this._hp -= damage;
	// 	return this._hp > 0 ? 	[`You were attacked by the ${attacker._name} for ${damage} damage.`] :
	// 							[`You were killed by the ${attacker._name}`];
	// }

	// levelUp() {
	// 	const sumRange = (min, max) => {
	// 		return min !== max ? sumRange(min, max - 1) + max : 0
	// 	}
	// 	if(this._experience >= (sumRange(0, this._level + 1)) * 100) {
	// 		this._level += 1;
	// 		this._attackValue += 10 * this._level;
	// 		this._defenseValue += 5 * this._level;
	// 		this._hp += 20 * this._level;
	// 		console.log("level: " + this._level, "attackValue: " + this._attackValue, "defenseValue " + this._defenseValue, "hp: " + this._hp);
	// 	}
	// }
};


export const enemyTemplate = (num) => {
	return {
		_name: 'Hench Men',
		_type: 'henchmen',
		_newCoords: null,
		_attackValue: 20 * num,
		_defenseValue: 10 * num,
		_hp: 5 * num,
		_experience: 10 * num,

		act: () => {
			this.walkAround();
		},
		
		walkAround: () => {
			const xOffset = Math.floor(Math.random() * 3) - 1;
			const yOffset = Math.floor(Math.random() * 3) - 1;
			this._newCoords = [this.x + xOffset, this.y + yOffset];
		}

	}
};

export const bossTemplate = {
	_name: "Boss",
	_type: "boss",
	_attackValue: 100,
	_defenseValue: 100,
	_hp: 50
}



