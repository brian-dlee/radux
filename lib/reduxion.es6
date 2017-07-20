let globalActionCreators = {};

const registerGlobalActionCreators = mapDispatchToProps =>
  (globalActionCreators = { ...globalActionCreators, ...mapDispatchToProps });

const buildDispatchToPropsMap = (actionCreators = {}) => dispatch => ({
  actions: bindActionCreators(
    { ...globalActionCreators, ...actionCreators },
    dispatch
  )
});

const buildStateToPropsMap = filter => state =>
  filter ? filter.apply(state) : state;

const connect = (...args) => {
  const Component = args.pop();
  const [mapStateToPropsArg, mapDispatchToPropsArg, mergeProps, options] = args;

  return reduxConnect(
    buildStateToPropsMap(mapStateToPropsArg),
    buildDispatchToPropsMap(mapDispatchToPropsArg),
    mergeProps,
    options
  )(Component);
};

export default {
  registerGlobalActionCreators,
  buildStateToPropsMap,
  buildDispatchToPropsMap,
  connect
};