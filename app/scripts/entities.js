
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
		_level: (num + 1)
	};
};

const bossTemplate = {
	_name: "Clown",
	_type: "clown",
	_attackValue: 100,
	_defenseValue: 100,
	_hp: 50,
	_experience: 1000,
	_level: 1000,
	
};

export { playerTemplate, enemyTemplate, bossTemplate};



