import {
  connectState,
  registerGlobalActionCreators,
  registerReducer,
  getReducers
} from "./radux";
import stateFilters from "./state-filters";
import StateConnection from "./state-connection";
import Reducer from "./reducer";

export default {
  stateConnection,
  registerGlobalActionCreators,
  registereReducer,
  getReducers
};

export { Reducer, StateConnection, stateFilters };
