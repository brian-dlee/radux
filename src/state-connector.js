import { connect as reduxConnect } from "react-redux";

import { BaseFilter, IncludeFilter, ExcludeFilter } from "./state-filters";
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
    this.stateFilter = params.stateFilter || new BaseFilter();
    this.mergeProps = params.mergeProps;
    this.options = params.options || {};
    this.actionCreators = {};
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
    return reduxConnect(
      buildStateToPropsMap(this.stateFilter),
      buildDispatchToPropsMap(this.actionCreators),
      this.mergeProps,
      this.options
    )(this.Component || Component);
  }

  /**
   * Configures what part of the state is kept when passing into Components state
   * Similar to mapStateToProps in Redux; Ultimately that's what this will configure
   * @param filter Array of state keys or Radux filter object
   * @param type Type of filter (include or exclude)
   * @returns {this} Returns this for chaining purposes
   */
  setStateFilter(filter, type = null) {
    if (filter instanceof BaseFilter) {
      this.stateFilter = filter;
    } else if (type === "include") {
      this.stateFilter = new IncludeFilter(filter);
    } else if (type === "exclude") {
      this.stateFilter = new ExcludeFilter(filter);
    } else {
      this.stateFilter = new BaseFilter(filter);
    }

    return this;
  }

  /**
   * Registers all actions that have been registered with the Reducer
   * @param Reducer A reducer object
   * @returns {this} Returns this for chaining purposes
   */
  useReducer(reducer) {
    if (!reducer instanceof Reducer) {
      throw `useReducer expects a Reducer to be passed in. ${type(
        reducer
      )} received.`;
    }

    this.addActionCreators(reducer.actionCreators);

    return this;
  }
}
