import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import Reducer from "./reducers/index.jsx";
import App from './components/app.jsx';
import './scss/application.scss';

const initialState = {
	world: null,
	floor: 0,
	player: {
		coords: [0, 0]
	},
	occupiedSquares: {},
	visibleSquares: {}
}


const store = createStore(Reducer, initialState);


ReactDOM.render(
	<Provider store={store}>
		<App width = {50} height = {50} depth = {4}/>
	</Provider>, 
	document.getElementById('app')
);


