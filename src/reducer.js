import path from "path";

/**
 * Extracts type without the reducer namespace attached
 * @param type
 * @returns String
 */
const extractSimpleType = type => {
  if (type.includes("/")) {
    return path.basename(type);
  }
  return type;
};

/**
 * Given a reducer name (namespace) and action return the full action name
 * @param name
 * @param type
 * @returns String
 */
const getFullActionName = (name, type) => {
  if (type.includes("/")) {
    return type;
  }

  return name + "/" + type;
};

/**
 * Radux implementation of Reducer
 */
export default class Reducer {
  /**
   * @param name Reducer name; cts as namespace for action types
   * @param initialState Initial state of reducer
   */
  constructor(name, initialState = {}) {
    this.name = name;
    this.actionCreators = {};
    this.initialState = initialState;
    this.reduceFunctions = {};
    this.dispatchExtensions = {};
  }

  /**
   * Action registration with Reducer
   * If only two arguments are supplied to this function, no createAction is assumed.
   * Type and onDispatch are mandatory
   *
   * @param type simple action name - will be prefixed with namespace
   * @param createAction Parameter mapping for action creator.
   *                     If action should have property x, this parameter should be
   *                     supplied a function that accepts arg x and returns a
   *                     new object with the same value keyed by x.
   *
   *                     Note: Type is autmatically mixed in by Radux as action types
   *                           are managed by radux.
   *
   *                     e.g. x => ({ x })
   *                                        This means action is dispatched with one argument
   *                                        and in reducer the action will have this value keyed by x
   *
   *                     function (x) {     An ES5 way to write the same thing
   *                       return {
   *                         x: x
   *                       };
   *                     }
   *
   * @param onDispatch   Function to execute when this action is dispatched.
   *                     Function accepts two arguments: (state, action)
   *                     See Redux reducers for more information on these functions
   * @returns {this}     Returns this for chaining purposes
   */
  addAction(type, createAction, onDispatch) {
    /**
     * If not all arguments are supplied the assume createAction was ommitted
     */
    if (arguments.length < 3) {
      [type, createAction, onDispatch] = [type, null, createAction];
    }

    const fullActionName = getFullActionName(this.name, type);

    /**
     * Mix type in to create standard Redux action
     * Register actionCreators under the full action name
     */
    this.actionCreators[fullActionName] = (...args) => {
      return {
        type,
        ...(createAction ? createAction(...args) : {})
      };
    };

    /**
     * Register onDispatch function under the full action name
     */
    this.reduceFunctions[fullActionName] = onDispatch;

    return this;
  }

  addDispatchExtension(type, dispatchExtension) {
    this.dispatchExtensions[
      getFullActionName(this.name, type)
    ] = dispatchExtension;

    return this;
  }

  /**
   * Get function that can be provided to redux combineReducers
   * @returns {function(state, action)} Returns function that accepts
   *                                    state and action and returns a mutated state
   *                                    based on the action dispatched
   */
  getReduxReducer() {
    return (state = this.initialState, action = {}) => {
      const type = getFullActionName(this.name, action.type);

      if (this.reduceFunctions[type])
        return { ...state, ...this.reduceFunctions[type](state, action) };

      return state;
    };
  }
}
