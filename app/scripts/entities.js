
const playerTemplate = {
	_name: "Astro",
	_type: "astro",
	_attackValue: 20,
	_defenseValue: 10,
	_hp: 100,
	_experience: 0,
	_level: 1,
	_message: [],
	_weapon: "Fists"
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



