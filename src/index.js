import {
  getStore,
  reducer,
  registerGlobalActionCreators,
  registerReducers,
  stateConnector
} from "./radux";

export default {
  getStore,
  registerGlobalActionCreators,
  registerReducers
};

export { reducer, stateConnector };
