import { bindActionCreators, combineReducers } from "redux";

import Reducer from "./reducer";
import StateConnector from "./state-connector";
import { convertDirectoryNotationToObject } from "./utils";

/* ####################################################################
 Publicly exposed functional adapters for Radux components
 ####################################################################### */

/**
 * Functional adapter for Reducer class
 * @param name Name of the reducer - acts as namespace for action types
 * @param initialState - initial state for reducer
 */
const reducer = (name, initialState = {}) => new Reducer(name, initialState);

/**
 * Functional adapter for StateConnector class
 * @param Component React Component to connect Redux state to
 * @param params Object consisting of any of the following: stateFilter, actionCreators, redux "connect" options or mergeProps
 */
const stateConnector = (Component, params) =>
  new StateConnector(Component, params);

/* ####################################################################
 Radux global action creator registration
 ####################################################################### */

/**
 *  * Radux package store for globally registered action creators
 * @type {{}}
 */
let globalActionCreators = {};

/**
 * Register action creators that will register with every radux connected Component
 * @param actionCreators
 */
const registerGlobalActionCreators = actionCreators =>
  (globalActionCreators = { ...globalActionCreators, ...actionCreators });

/* ####################################################################
 Radux Reducer registration and retrieval
 ####################################################################### */

/**
 *  * Radux package store for all registered reducers
 * @type {Reducer}
 */
let registeredReducers = {};

/**
 * Register reducer with radux - when getting the combined reducer all registered reducers will be in the result
 * @param name
 * @param reducer
 */
const registerReducer = (name, reducer) => {
  if (!reducer instanceof Reducer) {
    throw `registerReducer must be passed an object of type Reducer. ${type(
      reducer
    )} provided.`;
  }

  registeredReducers = {
    ...registeredReducers,
    ...{ [name]: reducer }
  };
};

/**
 * Bulk reducer registration
 * @param reducers
 */
const registerReducers = reducers =>
  Object.keys(reducers).forEach(r => registerReducer(r, reducers[r]));

/**
 * Returns all registered reducers after they are combined
 * @returns {Reducer<S>}
 */
const getReducers = () => {
  const reducers = {};

  Object.keys(registeredReducers).map(key => {
    reducers[key] = registeredReducers[key].getReduxReducer();
  });

  return combineReducers(reducers);
};

/* ####################################################################
      Redux connect argument builders
####################################################################### */

/**
 * Builds mapDispatchToProps argument of Redux connect
 * @param actionCreators
 */
const buildDispatchToPropsMap = (actionCreators = {}) => dispatch => {
  const combinedCreators = { ...globalActionCreators, ...actionCreators };
  const boundActionCreators = bindActionCreators(combinedCreators, dispatch);

  return {
    actions: convertDirectoryNotationToObject(boundActionCreators)
  };
};

/**
 * Builds mapStateToProps argument of Redux connect
 * @param filter
 */
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
