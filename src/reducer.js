import path from "path";

import { buildActionCreator } from "./radux";

const extractSimpleType = type => {
  if (type.includes("/")) {
    return path.basename(type);
  }
  return type;
};

export default class Reducer {
  constructor(name, initialState = {}) {
    this.name = name;
    this.actionCreators = {};
    this.initialState = initialState;
    this.reduceFunctions = {};
  }

  addAction(type, reduceFunction) {
    type = extractSimpleType(type);

    if (!this.actionCreators[this.name]) {
      this.actionCreators[this.name] = {};
    }

    this.actionCreators[this.name][type] = buildActionCreator(fullActionName);
    this.reduceFunctions[this.name][type] = reduceFunction;
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
