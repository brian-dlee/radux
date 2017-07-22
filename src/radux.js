import { bindActionCreators, combineReducers } from "redux";
import Reducer from "./reducer";
import StateConnector from "./state-connector";

let globalActionCreators = {};
let registeredReducers = {};

const convertDirectoryNotationToObject = obj => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (key.includes("/")) {
      const parts = key.split("/");
      const group = parts.shift();

      if (!newObj[group]) {
        newObj[group] = {};
      }

      if (parts[0].includes("/")) {
        throw `Action types deeper than two levels is not currently supported. Received ${key}.`;
      }

      newObj[group][parts.shift()] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

const stateConnector = (Component, params) =>
  new StateConnector(Component, params);
const reducer = (name, initialState = {}) => new Reducer(name, initialState);

const registerGlobalActionCreators = actionCreators =>
  (globalActionCreators = { ...globalActionCreators, ...actionCreators });

const registerReducer = (name, reducer) => {
  if (!reducer instanceof Reducer) {
    throw `registerReducer must be passed an object of type Reducer. ${type(
      reducer
    )} provided.`;
  }

  this.registeredReducers = {
    ...this.registeredReducers,
    ...{ [name]: reducer }
  };
};

const registerReducers = reducers =>
  Object.keys(reducers).forEach(r => registerReducer(r, reducers[r]));

const getReducers = () => {
  const reducers = {};

  Object.keys(this.registeredReducers).map(key => {
    reducers[key] = this.registeredReducers[key].getReduxReducer();
  });

  return combineReducers(reducers);
};

const buildDispatchToPropsMap = (actionCreators = {}) => dispatch => {
  const combinedCreators = { ...globalActionCreators, ...actionCreators };
  const boundActionCreators = bindActionCreators(combinedCreators, dispatch);

  return {
    actions: convertDirectoryNotationToObject(boundActionCreators)
  };
};

const buildStateToPropsMap = filter => state =>
  filter ? filter.apply(state) : state;

export {
  buildDispatchToPropsMap,
  buildStateToPropsMap,
  getReducers,
  reducer,
  registerGlobalActionCreators,
  registerReducers,
  stateConnector
};
