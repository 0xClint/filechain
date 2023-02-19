import { combineReducers, createStore } from "redux";
import { Reducer } from "./reducers";

const reducer = combineReducers({
  data: Reducer,
});

const initialState = {};

const store = createStore(reducer, initialState);

export default store;
