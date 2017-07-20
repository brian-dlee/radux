import { buildActionCreator } from "./radux";

export default class Reducer {
  constructor(name, initialState = {}) {
    this.name = name;
    this.actionCreators = {};
    this.initialState = initialState;
    this.reduceFunctions = {};
  }

  addAction(type, reduceFunction) {
    const fullActionName = this.getFullActionType(type);

    this.actionCreators[fullActionName] = buildActionCreator(
      fullActionName,
      data
    );
    this.reduceFunctions[fullActionName] = reduceFunction;
  }

  getFullActionType(actionType) {
    if (actionType.includes(this.name + "/")) return actionType;
    return this.name + "/" + actionType;
  }

  getReduxReducer() {
    return (state = this.initialState, action = {}) => {
      const actionType = this.getFullActionType(action.type);

      if (this.reduceFunctions[actionType])
        return { ...state, ...this.reduceFunctions[actionType] };

      return state;
    };
  }
}
