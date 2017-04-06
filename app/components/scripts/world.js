import * as ROT from '../../../bower_components/rot.js/rot.js';


export default class World {
	constructor(width, height, depth) {
		this._width = width;
		this._height = height;
		this._depth = depth;
		this._tiles = new Array(depth);
		this._regions = new Array(depth);
		//this._exporedTiles = new Array(depth);
		this._fov = [];
		this.setupFov();
		
		for(let z = 0; z < this._depth; z++) {
			this._tiles[z] = this.generateLevel(this._width, this._height);
			this._regions[z] = new Array(this._width);
			for(let x = 0; x < this._width; x++) {
				this._regions[z][x] = new Array(this._height);
			}
		}

		for(let z = 0; z < this._depth; z++) {
			this.setUpRegions(z);
		}
		this.connectAllRegions();

	}

	generateLevel(width, height) {
		let level = new Array(width);
		for(let x = 0; x < width; x++) {
			level[x] = new Array(height);
		}
		const generator = new ROT.Map.Cellular(this._width, this._height);
		generator.randomize(.5);
		for(let i = 0; i < 5; i++) {
			generator.create();
		}
		generator.create((x, y, v) => {
			v === 1 ? level[x][y] = 1 : level[x][y] = 0
		})
		return level;
	}

	canFillRegion(x, y, z) {
		if (x < 0 || x > this._width || y < 0 || y > this._height || z < 0 || z > this._depth) {
			return false;
		} else if (this._regions[z][x][y] != 0) {
			return false;
		} else {
			return this._tiles[z][x][y];
		}
	}

	fillRegion(region, x, y, z) {
		let tilesFilled = 1;
		const tiles = [{x: x, y: y}];
		let tile;
		let neighbors;
		this._regions[z][x][y] = region;

		while(tiles.length > 0) {
			tile = tiles.pop();
			neighbors = this.getNeighbors(tile.x, tile.y);
			while(neighbors.length > 0) {
				if(this.canFillRegion(tile.x, tile.y, z)) {
					this._regions[z][tile.x][tile.y] = region;
					tiles.push(tile);
					tilesFilled++;
				}
			}
		}
		return tilesFilled;
	}

	getNeighbors(x, y) {
		const tiles = [];
		for(let dX = -1; dX < 2; dX++) {
			for(let dY = -1; dY < 2; dY++) {
				if(dX === 0 && dY === 0) continue;
				tiles.push({x: x + dX, y: y + dY});
			}
		}
		return tiles.randomize();
	}

	setUpRegions(z) {
		let region = 1;
		let tilesFilled;
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				if(this.canFillRegion(x, y, z)) {
					tilesFilled = this.fillRegion(region, x, y, z);
					if(tilesFilled < 200) {
						this.removeRegion(region, z);
					} else {
						region++;
					}
				}
			}
		}
	}

	removeRegion(region, z) {
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				if(this._regions[z][x][y] == region) {
					this._regions[z][x][y] == 0;
					this._tiles[z][x][y] == 0;
				}
			}
		}
	}

	findRegionOverlaps(z, r1, r2) {
		let matches = [];
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				if(this._tiles[z][x][y] && this._tiles[z + 1][x][y] &&
					this._regions[z][x][y] == r1 && this._regions[z][x][y] == r2) {
					matches.push({x: x, y: y})
				}
			}
		}
		return matches;
	}

	connectRegions(z, r1, r2) {
		const overlaps = this.findRegionOverlaps(z, r1, r2);
		if(overlaps.length == 0) return false;
		const point = overlaps[0];
		this._tiles[z][point.x][point.y] = 2;
		//this._tiles[z + 1][point.x][point.y] = 3;
		return true;
	}

	connectAllRegions() {
		for(let z = 0; z < this._depth - 1; z++) {
			const connected = {};
			let key;
			for(let x = 0; x < this._width; x++) {
				for(let y = 0; y < this._height; y++) {
					key = this._regions[z][x][y] + ',' + this._regions[z + 1][x][y];
					if(this._tiles[z][x][y] && this._tiles[z + 1][x][y] && !connected[key]) {
						connected[key] = this.connectRegions(z, this._regions[z][x][y], this._regions[z + 1][x][y])
					}
				}
			}
		}
	}

	setupFov() {
		for(let z = 0; z < this._depth; z++) {
			this._fov.push(new ROT.FOV.PreciseShadowcasting((x, y) => {
				if(x >= 0 && x < this._width && y >= 0 && y <= this._height) {
					return this._tiles[z][x][y];
				}
			}, {topology: 4}))
		}
	}

	get fov() {
		return this._fov;
	}

	get tiles() {
		return this._tiles;
	}


}