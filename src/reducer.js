import path from "path";

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

  addAction(type, createAction, onDispatch) {
    if (arguments.length < 3) {
      [type, createAction, onDispatch] = [type, null, createAction];
    }

    const fullActionName = getFullActionName(this.name, type);

    this.actionCreators[fullActionName] = (...args) => {
      return {
        type,
        ...(createAction ? createAction(...args) : {})
      };
    };

    this.reduceFunctions[fullActionName] = onDispatch;

    return this;
  }

  getReduxReducer() {
    return (state = this.initialState, action = {}) => {
      const type = getFullActionName(this.name, action.type);

      if (this.reduceFunctions[type])
        return { ...state, ...this.reduceFunctions[type](state, action) };

      return state;
    };
  }
}
