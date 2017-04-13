import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import WorldReducer from "./reducers/world.jsx";
import './scss/application.scss';
import App from './components/app.jsx';



const initialData = {
	world: [],
	floor: 0,
	isLoading: true
}


const store = createStore(WorldReducer, initialData);


ReactDOM.render(
	<Provider store={store}>
		<App width={50} height={50} depth={4}/>
	</Provider>, 
	document.getElementById('app'));


