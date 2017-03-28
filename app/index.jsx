import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './scss/application.scss';
import App from './components/app.jsx';


ReactDOM.render(<App width={50} height={50} depth={4}/>, document.getElementById('app'));


