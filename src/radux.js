import { combineReducers } from "redux";
import Reducer from "./reducer";
import StateConnection from "./state-connection";

let globalActionCreators = {};
let registeredReducers = {};

const stateConnection = Component => new StateConnection(Component);

const registerGlobalActionCreators = mapDispatchToProps =>
  (globalActionCreators = { ...globalActionCreators, ...mapDispatchToProps });

const registerReducer = reducer => {
  if (!reducer instanceof Reducer) {
    console.error(
      `registerReducer must be passed an object of type Reducer. ${type(
        reducer
      )} provided.`
    );
  }

  this.registeredReducers = { ...this.registeredReducers, ...{ reducer } };
};

const getReducers = () => {
  const reducers = {};

  Object.keys(this.registeredReducers).map(key => {
    reducers[key] = this.registeredReducers.getReduxReducer();
  });

  return combineReducers(reducers);
};

const buildActionCreator = data => ({ type: fullActionName, ...data });

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
  stateConnection,
  getReducers,
  registerGlobalActionCreators,
  registerReducer
};
