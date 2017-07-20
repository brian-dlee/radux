import { buildActionCreator } from "./reduxion";

export default class Reducer {
  constructor(name, initialState = {}) {
    this.name = name;
    this.actionCreators = {};
    this.initialState = initialState;
    this.reduceFunctions = {};
  }

  addAction(type, reduceFunction) {
    const fullActionName = this.getFullActionType();

    this.actionCreators[fullActionName] = buildActionCreator(data);
    this.reduceFunctions[fullActionName] = reduceFunction;
  }

  getFullActionType(actionType) {
    if (actionType.includes(this.name + "/")) return actionType;
    return this.name + "/" + actionType;
  }

  getReduxReducer() {
    (state = initialState, action = {}) => {
      const actionType = getFullActionType(action.type);

      if (this.reduceFunctions[actionType])
        return { ...state, ...this.reduceFunctions[actionType] };

      return state;
    };
  }
}
