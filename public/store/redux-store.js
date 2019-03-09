import allGames from './reducers'
import { createStore } from 'redux'
import initialstate from './initialState.json'
//import { access } from 'fs';
const lodash  = require('lodash/array');

const initialState = (localStorage['redux-store']) ? JSON.parse(localStorage['redux-store']) : initialstate;

const store = createStore(allGames, initialState);

export default store