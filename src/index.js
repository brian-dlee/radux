import {
  registerGlobalActionCreators,
  registerReducer,
  getReducers
} from "./radux";
import stateFilters from "./state-filters";
import Connection from "./connection";
import Reducer from "./reducer";

export default {
  registerGlobalActionCreators,
  registereReducer,
  getReducers
};

export { Reducer, Connection, stateFilters };
