import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import World from "./scripts/world.js";
import Reducer from "./reducers/index.jsx";
import App from "./components/app.jsx";
import "./scss/application.scss";

const initialState = {
	world: new World(50, 50, 4),
	floor: 0,
	entities: [
		{
			coords: [0, 0]
		}
	],
	occupiedSquares: {},
	lightsOn: false,
	gameEnd: false,
	message: [],
	width: 50,
	height: 50,
	depth: 4
};

const store = createStore(Reducer, initialState, applyMiddleware(thunk));


ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>, 
	document.getElementById("app")
);



