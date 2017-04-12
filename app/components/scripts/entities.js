
export const playerTemplate = {
	_name: 'Hero',
	_type: 'hero',
	_attackValue: 20,
	_defenseValue: 10,
	_hp: 100,
	_experience: 0,
	_level: 0,
	_message: [],
	_weapon: "Fists",

	takeDamage(attacker, damage) {
		this._hp -= damage;
		this._hp > 0 ? 	this._message.push(`You were attacked by the ${attacker._name} for ${damage} damage.`) :
						this._message.push(`You were killed by the ${attacker._name}`);
	},

	levelUp() {
		const sumRange = (min, max) => {
			return min !== max ? sumRange(min, max - 1) + max : 0
		}
		if (this._experience >= (sumRange(0, this._level + 1)) * 100) {
			this._level += 1;
			this._attackValue += 10 * this._level;
			this._defenseValue += 5 * this._level;
			this._hp += 20 * this._level;
		}
	},

	attack(opponent) {
		const attack = this._attackValue;
		const defense = entity._defenseValue;
		const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
		this._message = [];
		opponent.takeDamage(this, damage);
		if(opponent._hp > 0) {
			this._message.unshift(`You attacked the ${opponent._name} for ${damage} damage`);
		} else {
			this._experience += opponent._experience;
			if(this.levelUp());
			this._message.unshift(`You defeated the ${opponent._name}`);
		}
	}
};


export const enemyTemplate = (num) => {
	return {
		_name: 'Alien',
		_type: 'alien',
		_newCoords: null,
		_attackValue: 20 * num,
		_defenseValue: 10 * num,
		_hp: 5 * num,
		_experience: 10 * num,
		_level: num,
		
		walkAround() {
			const xOffset = Math.floor(Math.random() * 3) - 1;
			const yOffset = Math.floor(Math.random() * 3) - 1;
			this._newCoords = [this.x + xOffset, this.y + yOffset];
		},

		act() {
			this.walkAround();
		}

	}
};

export const bossTemplate = {
	_name: "Clown",
	_type: "clown",
	_attackValue: 100,
	_defenseValue: 100,
	_hp: 50,
	_level: 1000,
	_experience: 1000,
	act() {
		return;
	}
};


//export {playerTemplate, enemyTemplate, bossTemplate}


