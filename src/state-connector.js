import { connect as reduxConnect } from "react-redux";

import {
  BaseFilter,
  CustomFilter,
  IncludeFilter,
  ExcludeFilter,
  PermissiveFilter,
  RestrictiveFilter
} from "./state-filters";
import { buildDispatchToPropsMap, buildStateToPropsMap } from "./radux";
import Reducer from "./reducer";

/**
 * Helper class meant to organize/build
 * the arguments that are passed to Redux connect
 */
export default class StateConnector {
  /**
   * Creates connector given a Component and/or the Redux connect arguments mergeProps and options
   * @param Component
   * @param params
   */
  constructor(Component = null, params = {}) {
    this.Component = Component;
    this.stateFilters = [params.stateFilter || new RestrictiveFilter()];
    this.mergeProps = params.mergeProps;
    this.options = params.options || {};
    this.actionCreators = {};
    this.connectedReducers = [];
  }

  /**
   * Mixes in action creators to currently registered action creators
   * @param actionCreators
   * @returns {this} Returns this for chaining purposes
   */
  addActionCreators(actionCreators) {
    this.actionCreators = { ...this.actionCreators, ...actionCreators };
    return this;
  }

  /**
   * Wrapper for Redux connect.
   * Call on component to connect redux state management
   * @param Component
   * @returns {*}
   */
  connectTo(Component) {
    const dispatchExtensions = {};

    this.connectedReducers.forEach(r => {
      Object.keys(r.dispatchExtensions).forEach(
        type => (dispatchExtensions[type] = r.dispatchExtensions[type])
      );
    });

    return reduxConnect(
      buildStateToPropsMap(this.stateFilters),
      buildDispatchToPropsMap(this.actionCreators, dispatchExtensions),
      this.mergeProps,
      this.options
    )(this.Component || Component);
  }

  /**
   * Configures what part of the state is kept when passing into Components state
   * Similar to mapStateToProps in Redux; Ultimately that's what this will configure
   * @param {String[]|function|String|StateFilter} filter Array of state keys to include,
   *                                                      function returning true when a state key should be kept,
   *                                                      "permissive" to preserve all state keys,
   *                                                      or a radux state filter object
   * @returns {this} Returns this for chaining purposes
   */
  addStateFilter(filter) {
    let newFilter = filter;

    if (filter instanceof BaseFilter === false) {
      if (typeof filter === "function") {
        newFilter = new CustomFilter(filter);
      } else if (filter === "permissive") {
        newFilter = new PermissiveFilter();
      } else {
        newFilter = new IncludeFilter(filter);
      }
    }

    if (newFilter instanceof BaseFilter === false) {
      throw "Invalid filter provided to reducer.addStateFilter. Recieved object of type " +
        typeof newFilter;
    }

    this.stateFilters.push(newFilter);

    return this;
  }

  /**
   * Deprecated! Use addStateFilter instead
   * @param {String[]|Filter} filter Array of state keys or Radux filter object
   * @returns {this} Returns this for chaining purposes
   */
  setStateFilter(filter) {
    try {
      console.warn(
        "DEPRECATED: Use addStateFilter instead of setStateFilter. " +
          "reducer.setStateFilter will be removed in later versions of radux."
      );
    } catch (e) {}

    return this.addStateFilter(filter);
  }

  /**
   * Registers all actions that have been registered with the Reducer
   * @param reducer A reducer object
   * @returns {this} Returns this for chaining purposes
   */
  useReducer(reducer) {
    if (!reducer instanceof Reducer) {
      throw `useReducer expects a Reducer to be passed in. ${type(
        reducer
      )} received.`;
    }

    this.connectedReducers.push(reducer);
    this.addActionCreators(reducer.actionCreators);
    this.addStateFilter(new IncludeFilter([reducer.name]));

    return this;
  }
}
