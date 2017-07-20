import { bindActionCreators, combineReducers } from "redux";
import Reducer from "./reducer";
import StateConnection from "./state-connection";

let globalActionCreators = {};
let registeredReducers = {};

const stateConnection = (Component, params) =>
  new StateConnection(Component, params);
const reducer = (name, initialState = {}) => new Reducer(name, initialState);

const registerGlobalActionCreators = mapDispatchToProps =>
  (globalActionCreators = { ...globalActionCreators, ...mapDispatchToProps });

const registerReducer = (name, reducer) => {
  if (!reducer instanceof Reducer) {
    console.error(
      `registerReducer must be passed an object of type Reducer. ${type(
        reducer
      )} provided.`
    );
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
    reducers[key] = this.registeredReducers.getReduxReducer();
  });

  return combineReducers(reducers);
};

const buildActionCreator = actionName => data => ({
  type: actionName,
  ...data
});

const buildDispatchToPropsMap = (actionCreators = {}) => dispatch => ({
  actions: bindActionCreators(
    { ...globalActionCreators, ...actionCreators },
    dispatch
  )
});

const buildStateToPropsMap = filter => state =>
  filter ? filter.apply(state) : state;

export {
  buildActionCreator,
  buildDispatchToPropsMap,
  buildStateToPropsMap,
  getReducers,
  reducer,
  registerGlobalActionCreators,
  registerReducers,
  stateConnection
};
