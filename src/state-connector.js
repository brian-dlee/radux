import { connect as reduxConnect } from "react-redux";

import { BaseFilter, IncludeFilter, ExcludeFilter } from "./state-filters";
import { buildDispatchToPropsMap, buildStateToPropsMap } from "./radux";
import Reducer from "./reducer";

export default class StateConnector {
  constructor(Component = null, params = {}) {
    this.Component = Component;
    this.stateFilter = params.stateFilter;
    this.mergeProps = params.mergeProps;
    this.options = params.options || {};
    this.actionCreators = params.actionCreators || {};
  }

  setOptions(options) {
    this.options = { ...options };
    return this;
  }

  addActionCreators(actionCreators) {
    this.actionCreators = { ...this.actionCreators, ...actionCreators };
    return this;
  }

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

  connectTo(Component) {
    return reduxConnect(
      buildStateToPropsMap(this.stateFilter),
      buildDispatchToPropsMap(this.actionCreators),
      this.mergeProps,
      this.options
    )(this.Component || Component);
  }

  useReducer(reducer) {
    if (!reducer instanceof Reducer) {
      throw `useReducer expects a Reducer to be passed in. ${type(
        reducer
      )} received.`;
    }

    this.addActionCreators(reducer.actionCreators);
  }
}
