import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import WorldReducer from "./reducers/world.jsx";
import App from './components/app.jsx';
import './scss/application.scss';



const initialData = {
	world: [],
	floor: 0,
	width: 50,
	height: 50,
	depth: 4
}


const store = createStore(WorldReducer, initialData);


ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>, 
	document.getElementById('app'));


