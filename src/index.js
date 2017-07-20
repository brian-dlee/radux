import {
  getReducers,
  reducer,
  registerGlobalActionCreators,
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
  registerReducers,
  stateConnection
};

export { Reducer, StateConnection, stateFilters };
