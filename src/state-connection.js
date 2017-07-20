import { connect as reduxConnect } from "react-redux";
import { bindActionCreators } from "redux";

import { BaseFilter, IncludeFilter, ExcludeFilter } from "./state-filters";
import { buildDispatchToPropsMap, buildStateToPropsMap } from "./radux";

export default class StateConnection {
  constructor(Component = null) {
    this.Component = Component;
    this.stateFilter = null;
    this.mergeProps = null;
    this.options = null;
    this.actionCreators = {};
  }

  setOptions(options) {
    this.options = { ...options };
    return this;
  }

  addActionCreators(actionCreators) {
    this.actionCreators = { ...this.actionCreators, actionCreators };
    return this;
  }

  setStateFilter(filter, exclude = false) {
    if (filter instanceof BaseFilter) {
      this.stateFilter = filter;
    } else {
      const filterType = exclude ? ExcludeFilter : IncludeFilter;
      this.stateFilter = new filterType(filter);
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
}
