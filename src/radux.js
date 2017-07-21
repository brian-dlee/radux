import { bindActionCreators, combineReducers } from "redux";
import Reducer from "./reducer";
import StateConnection from "./state-connection";

let globalActionCreators = {};
let registeredReducers = {};

const convertDirectoryNotationToObject = obj => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (key.includes("/")) {
      const parts = key.split("/");
      const first = parts.shift();

      newObj[first] = convertDirectoryNotationToObject({
        [parts.join("/")]: obj[key]
      });
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

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
    reducers[key] = this.registeredReducers[key].getReduxReducer();
  });

  return combineReducers(reducers);
};

const buildActionCreator = actionName => data => ({
  type: actionName,
  ...data
});

const buildDispatchToPropsMap = (actionCreators = {}) => dispatch => {
  const boundActionCreators = {
    ...bindActionCreators(globalActionCreators, dispatch),
    ...bindActionCreators(actionCreators, dispatch)
  };

  return {
    actions: convertDirectoryNotationToObject(boundActionCreators)
  };
};

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
