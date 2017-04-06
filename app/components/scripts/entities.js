
const playerActor = {
	name: "PlayerActor",
	groupName: "Actor",
	init(template) {
		this._name = 'Jedi'
	},
	act() {
		this.engine.lock();
	}
}

const trooperActor = {
	name: "TrooperActor",
	groupName: "Actor",
	init(template) {
		this._newCoords = null;
		this._newTrooperCoords = false;
		this._name = 'storm trooper';
	},
	act() {
		this.walkAround();
		if(Math.random() < .005) {
			const xOffset = Math.floor(Math.random() * 3) - 1;
			const yOffset = Math.floor(Math.random() * 3) - 1;
			this._newTrooperCoords = [this.x + xOffset, this.y + yOffset];
		} else {
			this._newTrooperCoords = false;
		}
	},
	walkAround() {
		const xOffset = Math.floor(Math.random() * 3) - 1;
		const yOffset = Math.floor(Math.random() * 3) - 1;
		this._newCoords = [this.x + xOffset, this.y + yOffset];
	}
}

const destructible = {
	name: "Destructible",
	init(template) {
		this._hp = template._hp || 10;
		this._defenseValue = template._defenseValue || 0;
	},
	takeDamage(attacker, damage) {
		this._hp -= damage;
		if(this._hp > 0 && this.hasMixin('Attacker') && !this.hasMixin('PlayerActor')) {
			this.attack(attacker);
			return `Attack the ${this._name} for ${damage} damage, you have.`
		} else if(this._hp <= 0 && !this.hasMixin('PlayerActor')) {
			console.log(this._attackValue, this._defenseValue, this._experience, this._hp);
			attacker._experience += this._experience
			attacker.levelUp()
			return `Defeat the ${this._name}, you have.`
		}							
	},
	getMaxHp() {
		return this._maxHp;
	},
	getHp() {
		return this._hp;
	},
	getDefenseValue() {
		return this._defenseValue;
	}
}

const attacker = {
	name: "Attacker",
	init(template) {
		this._attackValue = template._attackValue || 10;
		this._level = template._level || 0;
		this._experience = template._experience || 0;
	},
	attack(entity) {
		if(entity.hasMixin('Destructible')) {
			const attack = this.getAttackValue();
			const defense = entity.getDefenseValue();
			const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
			return entity.takeDamage(this, damage);
		}
	},
	getAttackValue() {
		return this._attackValue;
	},
	levelUp() {
		const sumRange = (min, max) => {
			return min !== max ? sumRange(min, max - 1) + max : 0
		}
		if(this._experience === (sumRange(0, this._level + 1)) * 100) {
			this._level += 1;
			this._attackValue += 10 * this._level;
			this._defenseValue += 5 * this._level;
			this._hp += 20 * this._level;
			console.log("level: " + this._level, "attackValue: " + this._attackValue, "defenseValue " + this._defenseValue, "hp: " + this._hp);
		}
	}
}

export const playerTemplate = {
	_attackValue: 20,
	_defenseValue: 10,
	_hp: 100,
	_experience: 0,
	_level: 0,
	mixins: [playerActor, attacker, destructible]
};


export const trooperTemplate = {
	_attackValue: 20,
	_defenseValue: 10,
	_hp: 10,
	_experience: 10,
	mixins: [trooperActor, attacker, destructible]
};


