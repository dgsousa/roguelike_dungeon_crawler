import { createSelector } from "reselect";
import React from "react";


const getPlayer = (state) => state.entities[0] || ({coords: [0, 0]});
const getEntities = (state) => state.entities;
const getHeight = (state) => state.height;
const getWidth = (state) => state.width;
const getViewHeight = (state) => state.viewHeight;
const getViewWidth = (state) => state.viewWidth;
const getWorld = (state) => state.world;
const getFloor = (state) => state.floor;
const getLightsOn = (state) => state.lightsOn;


export const getScreenCoords = createSelector(
	[getPlayer, getWidth, getHeight],
	(player, width, height) => {
		return [
			Math.max(0, Math.min((player.coords[0]) - 12, width - 25)),
			Math.max(0, Math.min((player.coords[1]) - 7, height - 15))
		];
	}
);

const getOccupiedSquares = createSelector(
	[getEntities],
	entities => {
		const occupiedSquares = {};
		entities.forEach((entity) => {
			occupiedSquares[`${entity.coords[0]}x${entity.coords[1]}`] = entity._type;
		});
		return occupiedSquares;
	}
		
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
	[getScreenCoords, getViewWidth, getViewHeight, getTileClassFunction],
	(screenCoords, viewWidth, viewHeight, getTileClass) => {
		const rows = [];
		for(let y = screenCoords[1]; y < screenCoords[1] + viewHeight; y++) {
			let row = [];
			for(let x = screenCoords[0]; x < screenCoords[0] + viewWidth; x++) {
				const tileClass = getTileClass(x, y);
				row.push(
					<div	
						className={`tile ${tileClass}`} 
						key={x+"x"+y} 
						style={{left: 30 * (x - screenCoords[0])}}>
					</div>
				);
			}
			rows.push(
				<div
					className={"row"} 
					key={y}>
					{row}
				</div>
			);
		}
		return rows;
	}
);











