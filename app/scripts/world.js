import * as ROT from '../../bower_components/rot.js/rot.js';


export default class World {
	constructor(width, height, depth) {
		this._width = width;
		this._height = height;
		this._depth = depth;
		this._tiles = new Array(depth);
		this._regions = new Array(depth);
		this._fov = [];
		this._pathArray = [];
		this.setupFov();
		
		
		for(let z = 0; z < this._depth; z++) {
			this._tiles[z] = this.generateLevel(this._width, this._height);
			this._regions[z] = new Array(this._width);
			for(let x = 0; x < this._width; x++) {
				this._regions[z][x] = new Array(this._height);
				for(let y = 0; y < this._height; y++) {
					this._regions[z][x][y] = 0;
				}
			}
		}
		for(let z = 0; z < this._depth; z++) {
			this.setUpRegions(z);
		}
		this.connectAllRegions();
		this.findPaths();

	}

	generateLevel(width, height) {
		let level = new Array(width);
		for(let x = 0; x < width; x++) {
			level[x] = new Array(height);
		}
		const generator = new ROT.Map.Cellular(width, height, {topology: 8});
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
				tile = neighbors.pop();
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
				if(x + dX >= 0 && x + dX < this._width && y + dY >= 0 && y + dY < this._height)
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
						this._pathArray.push([z, x, y]);
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
					this._regions[z][x][y] = 0;
				}
			}
		}
	}

	findRegionOverlaps(z, r1, r2) {
		let matches = [];
		for(let x = 0; x < this._width; x++) {
			for(let y = 0; y < this._height; y++) {
				if(this._regions[z][x][y] && this._regions[z + 1][x][y] &&
					this._regions[z][x][y] == r1 && this._regions[z][x][y] == r2) {
					matches.push({x: x, y: y})
				}
			}
		}
		return matches.randomize();
	}

	connectRegions(z, r1, r2) {
		const overlaps = this.findRegionOverlaps(z, r1, r2);
		if(overlaps.length == 0) return false;
		const point = overlaps[0];
		this._regions[z][point.x][point.y] = 5;
		//this._regions[z + 1][point.x][point.y] = 3;
		return true;
	}

	connectAllRegions() {
		for(let z = 0; z < this._depth - 1; z++) {
			const connected = {};
			let key;
			for(let x = 0; x < this._width; x++) {
				for(let y = 0; y < this._height; y++) {
					key = this._regions[z][x][y] + ',' + this._regions[z + 1][x][y];
					if(this._regions[z][x][y] && this._regions[z + 1][x][y] && !connected[key]) {
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
					return this._regions[z][x][y] > 0;
				}
			}, {topology: 4}))
		}
	}

	findPaths() {
		const self = this;
		for(let i = 0; i < this._pathArray.length - 1; i++) {
			if(this._pathArray[i][0] === this._pathArray[i + 1][0]) {
				const z = this._pathArray[i][0];
				const x1 = this._pathArray[i][1];
				const y1 = this._pathArray[i][2];
				const x2 = this._pathArray[i + 1][1];
				const y2 = this._pathArray[i + 1][2]; 
				
				for(let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {	
					this._regions[z][x][y1] = 3;
				}
				for(let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {	
					this._regions[z][x2][y] = 3;
				}
			}
		}
	}

	get fov() {
		return this._fov;
	}

	get tiles() {
		return this._tiles;
	}

	get regions() {
		return this._regions;
	}


}