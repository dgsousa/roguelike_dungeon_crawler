
const playerActor = {
	name: "PlayerActor",
	groupName: "Actor",
	init(template) {
		this._name = 'Hero'
	},
	act() {
		this.engine.lock();
	}
}

const enemyActor = {
	name: "EnemyActor",
	groupName: "Actor",
	init(template) {
		this._newCoords = null;
		this._name = 'hench men';
		this._type = 'henchmen'
	},
	act() {
		this.walkAround();
	},
	walkAround() {
		const xOffset = Math.floor(Math.random() * 3) - 1;
		const yOffset = Math.floor(Math.random() * 3) - 1;
		this._newCoords = [this.x + xOffset, this.y + yOffset];
	}
}

const bossActor = {
	name: "BossActor",
	groupName: "Actor",
	init(template) {
		this._name = "Boss Man",
		this._type = "boss"
	},
	act() {
		return;
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
			const message = this.attack(attacker);
			return [`You attacked the ${this._name} for ${damage} damage.`, `${message}`]
		} else if(this._hp <= 0 && !this.hasMixin('PlayerActor')) {
			attacker._experience += this._experience;
			attacker.levelUp();
			return [`You defeated the ${this._name}.`]
		} else if(this._hp > 0 && this.hasMixin('Attacker') && this.hasMixin('PlayerActor')) {
			return [`You were attacked by the ${attacker._name} for ${damage} damage.`];
		} else if(this._hp < 0 && this.hasMixin('Attacker') && this.hasMixin("PlayerActor")) {
			return [`You were killed by the ${attacker._name}`];
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
		if(this._experience >= (sumRange(0, this._level + 1)) * 100) {
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


export const enemyTemplate = (num) => {
	return {
		_attackValue: 20 * num,
		_defenseValue: 10 * num,
		_hp: 5 * num,
		_experience: 10 * num,
		mixins: [enemyActor, attacker, destructible]
	}
};

export const bossTemplate = {
	_attackValue: 100,
	_defenseValue: 100,
	_hp: 50,
	mixins: [bossActor, attacker, destructible]
}



