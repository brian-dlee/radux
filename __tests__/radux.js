import * as radux from "../src/radux";
import Reducer from "../src/reducer";
import StateConnector from "../src/state-connector";

describe("radux", () => {
  const storeName = "jest";
  let stateConnector;
  let globalReducer;
  let reducer1;
  let reducer2;
  let reducer3;

  it("has valid exports", () =>
    expect(
      Object.keys(radux).reduce(
        (allAreDefined, key) => !!radux[key] && allAreDefined,
        true
      )
    ).toBe(true));

  it("can create reducers", () => {
    globalReducer = radux.reducer("globals", { g: 0 });
    reducer1 = radux.reducer("jest", { v: 0 }).addAction(
      "add",
      value => ({ value }),
      (state, action) => ({
        ...state,
        v: state.v + action.value
      })
    );
    reducer2 = radux.reducer("jest2", { v: 1 });
    reducer3 = radux.reducer("jest3", { v: 2 });

    expect(reducer1).toBeInstanceOf(Reducer);
    expect(reducer2).toBeInstanceOf(Reducer);
    expect(reducer3).toBeInstanceOf(Reducer);
    expect(globalReducer).toBeInstanceOf(Reducer);
  });

  it("can register reducers", () => {
    radux.registerReducers({ jest: reducer1 }, storeName);
    radux.registerReducers({ jest2: reducer2 });
    radux.registerGlobalReducer(globalReducer);
  });

  it("can create unnamed stores", () => {
    radux.addStore();

    expect(typeof radux.getStore().dispatch).toBe("function");
  });

  it("can create named stores", () => {
    radux.addNamedStore(storeName, { jest3: reducer3 });

    expect(typeof radux.getStore(storeName).dispatch).toBe("function");
  });

  it("creates unnamed stores that include all registered reducers", () => {
    const unnamedStore = radux.getStore();
    const { globals, jest2 } = unnamedStore.getState();

    expect(globals && jest2).toBeTruthy();
  });

  it("creates named stores that include all registered reducers", () => {
    const namedStore = radux.getStore(storeName);
    const { globals, jest, jest3 } = namedStore.getState();

    expect(globals && jest && jest3).toBeTruthy();
  });

  it("can create state connectors", () => {
    stateConnector = radux.stateConnector();
    expect(stateConnector).toBeInstanceOf(StateConnector);
  });

  it("can create mapDispatchToProps redux.Connect parameter", () => {
    const mdtp = radux.buildDispatchToPropsMap({
      ...reducer1.actionCreators,
      ...reducer2.actionCreators,
      ...reducer3.actionCreators
    });

    expect(typeof mdtp).toBe("function");
    expect(mdtp().actions).toBeTruthy();
  });

  it("can create mapStateToProps redux.Connect parameter", () => {
    const mstp = radux.buildStateToPropsMap();

    expect(typeof mstp).toBe("function");
    expect(mstp(radux.getStore().getState()).globals).toBeTruthy();
  });

  it("can dispatch actions", () => {
    radux.dispatch(storeName, reducer1.actionCreators["jest/add"](10));
    expect(radux.getStore(storeName).getState().jest.v).toBe(10);
  });
});
