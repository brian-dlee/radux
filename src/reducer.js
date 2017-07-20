import path from "path";

import { buildActionCreator } from "./radux";

const extractSimpleType = type => {
  if (type.includes("/")) {
    return path.basename(type);
  }
  return type;
};

const getFullActionName = (name, type) => {
  if (type.includes("/")) {
    return type;
  }

  return name + "/" + type;
};

export default class Reducer {
  constructor(name, initialState = {}) {
    this.name = name;
    this.actionCreators = {};
    this.initialState = initialState;
    this.reduceFunctions = {};
  }

  addAction(type, reduceFunction) {
    const fullActionName = getFullActionName(this.name, type);
    const simpleActionName = extractSimpleType(type);

    if (!this.actionCreators[this.name]) {
      this.actionCreators[this.name] = {};
    }

    if (!this.reduceFunctions[this.name]) {
      this.reduceFunctions[this.name] = {};
    }

    this.actionCreators[this.name][simpleActionName] = buildActionCreator(
      fullActionName
    );
    this.reduceFunctions[this.name][simpleActionName] = reduceFunction;
  }

  addActions(actions) {
    Object.keys(actions).forEach(action =>
      this.addAction(action, actions[action])
    );
  }

  getReduxReducer() {
    return (state = this.initialState, action = {}) => {
      const type = extractSimpleType(action.type);

      if (this.reduceFunctions[this.name][type])
        return { ...state, ...this.reduceFunctions[this.name][type] };

      return state;
    };
  }
}
