
const playerTemplate = {
	_name: "Astro",
	_type: "astro",
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
			return min !== max ? sumRange(min, max - 1) + max : 0;
		};
		if (this._experience >= (sumRange(0, this._level + 1)) * 100) {
			this._level += 1;
			this._attackValue += 10 * this._level;
			this._defenseValue += 5 * this._level;
			this._hp += 20 * this._level;
		}
	},

	attack(opponent) {
		const attack = this._attackValue;
		const defense = opponent._defenseValue;
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


const enemyTemplate = (num) => {
	return {
		_name: "Alien",
		_type: "alien",
		_attackValue: 20 * (num + 1),
		_defenseValue: 10 * (num + 1),
		_hp: 5 * (num + 1),
		_experience: 10 * (num + 1),
		_level: (num + 1),

		attack(opponent) {
			const attack = this._attackValue;
			const defense = opponent._defenseValue;
			const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
			opponent.takeDamage(this, damage);
		},

		takeDamage(attacker, damage) {
			this._hp -= damage;
			if(this._hp > 0) this.attack(attacker);			
		}

	};
};

const bossTemplate = {
	_name: "Clown",
	_type: "clown",
	_attackValue: 100,
	_defenseValue: 100,
	_hp: 50,
	_level: 1000,
	_experience: 1000
};


export default {playerTemplate, enemyTemplate, bossTemplate};



