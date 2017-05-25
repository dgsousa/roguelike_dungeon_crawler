import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import World from "./scripts/world.js";
import AppReducer from "./reducers/index.jsx";
import App from "./components/app.jsx";
import "./scss/application.scss";

const initialState = {
	world: new World(50, 50, 4),
	floor: 0,
	entities: [],
	lightsOn: false,
	gameEnd: "",
	message: [],
	width: 50,
	height: 50,
	viewWidth: 25,
	viewHeight: 15,
	depth: 4
};

const store = createStore(AppReducer, initialState, applyMiddleware(thunk));


ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>, 
	document.getElementById("app")
);



