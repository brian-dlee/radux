import {
  getReducers,
  reducer,
  registerGlobalActionCreators,
  registerReducer,
  registerReducers,
  stateConnection
} from "./radux";
import stateFilters from "./state-filters";
import StateConnection from "./state-connection";
import Reducer from "./reducer";

export default {
  getReducers,
  reducer,
  registerGlobalActionCreators,
  registerReducer,
  registerReducers,
  stateConnection
};

export { Reducer, StateConnection, stateFilters };
