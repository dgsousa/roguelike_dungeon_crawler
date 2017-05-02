import { createSelector } from "reselect";
import { createElement } from "react";


const getPlayer = (state) => state.entities[0];
const getHeight = (state) => state.height;
const getWidth = (state) => state.width;
const getViewHeight = (state) => state.viewHeight;
const getViewWidth = (state) => state.viewWidth;
const getWorld = (state) => state.world;
const getFloor = (state) => state.floor;
const getOccupiedSquares = (state) => state.occupiedSquares;
const getLightsOn = (state) => state.lightsOn;


export const getScreenY = createSelector(
	[getPlayer, getHeight],
	(player, height) => Math.max(0, Math.min(player.coords[1] - 7, height - 15))
);

export const getScreenX = createSelector(
	[getPlayer, getWidth],
	(player, width) => Math.max(0, Math.min(player.coords[0] - 12, width - 25))
);

const getVisibleCellsFunction = createSelector(
	[getWorld, getFloor],
	(world, floor) => {
		return function(playerCoords) {
			const visibleCells = {};
			world.fov[floor].compute(playerCoords[0], playerCoords[1], 4, (x, y) => {
				visibleCells[`${x},${y},${floor}`] = true;
			});
			return visibleCells;
		};
	}
);

const getTileClassFunction = createSelector(
	[getWorld, getFloor, getPlayer, getOccupiedSquares, getLightsOn, getVisibleCellsFunction], 
	(world, floor, player, occupiedSquares, lightsOn, getVisibleCells) => {
		const map = world._regions[floor];
		const visibleCells = getVisibleCells(player.coords);
		const chars = {
			"0": "wall",
			"1": "floor",
			"2": "floor",
			"3": "floor",
			"5": "stairs",
			"6": "grey"
		};
		return function(x, y) {
			return 	visibleCells[`${x},${y},${floor}`] || lightsOn ?
						occupiedSquares[`${x}x${y}`] || chars[map[x][y]] : chars["6"];
		};
	}
);

export const getBoard = createSelector(
	[getScreenX, getScreenY, getViewWidth, getViewHeight, getTileClassFunction],
	(screenX, screenY, viewWidth, viewHeight, getTileClass) => {
		const rows = [];
		for(let y = screenY; y < screenY + viewHeight; y++) {
			let row = [];
			for(let x = screenX; x < screenX + viewWidth; x++) {
				const tileClass = getTileClass(x, y);
				row.push(createElement("div", {	
					className: `tile ${tileClass}`, 
					key: x+"x"+y, 
					style: {left: 30 * (x - screenX)}}, " "));
			}
			rows.push(createElement("div", {
				className: "row", 
				key: y
			}, row));
		}
		return rows;
	}
);











