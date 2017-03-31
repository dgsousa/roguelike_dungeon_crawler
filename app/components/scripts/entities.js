
const playerActor = {
	name: "PlayerActor",
	groupName: "Actor",
	init(template) {
		this._name = 'Jedi'
	},
	act() {
		this._engine.lock();
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
		this._maxHp = template._maxHp || 10;
		this._hp = template._hp || this._maxHp;
		this._defenseValue = template._defenseValue || 0;
	},
	takeDamage(attacker, damage) {
		this._hp -= damage;
		if(this._hp > 0 && this.hasMixin('Attacker') && !this.hasMixin('PlayerActor')) {
			this.attack(attacker);
		} else if(this._hp < 0 && this.hasMixin('PlayerActor')) {
			console.log("You Lose!")
			this.act();
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
	},
	attack(entity) {
		if(entity.hasMixin('Destructible')) {
			const attack = this.getAttackValue();
			const defense = entity.getDefenseValue();
			const damage = 1 + Math.floor(Math.random() * Math.max(0, attack - defense));
			entity.takeDamage(this, damage);
			return entity._hp > 0 ? `Attack the ${entity._name} for ${damage} damage, you have.` :
									`Defeat the ${entity._name}, you have.`
		}
	},
	getAttackValue() {
		return this._attackValue;
	}
}

export const playerTemplate = {
	_attackValue: 15,
	_defenseValue: 20,
	_maxHp: 2,
	mixins: [playerActor, attacker, destructible]
};


export const trooperTemplate = {
	_attackValue: 5,
	_defenseValue: 10,
	_maxHp: 5,
	mixins: [trooperActor, attacker, destructible]
};


