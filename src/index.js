import {
  connectState,
  registerGlobalActionCreators,
  registerReducer,
  registerReducers,
  getReducers
} from "./radux";
import stateFilters from "./state-filters";
import StateConnection from "./state-connection";
import Reducer from "./reducer";

export default {
  stateConnection,
  registerGlobalActionCreators,
  registereReducer,
  registerReducers,
  getReducers
};

export { Reducer, StateConnection, stateFilters };
