import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";

import radux from "../src";
import Reducer from "../src/reducer";
import StateConnector from "../src/state-connector";

const reducer = new Reducer("jest");

reducer.addAction(
  "add",
  value => ({ value }),
  (state, action) => ({
    ...state,
    v: state.v + action.value
  })
);

const JestComponent = () =>
  React.createElement("div", { className: "JestComponent" });

describe("state-connector", () => {
  let stateConnector;

  it("constructs", () => {
    stateConnector = new StateConnector();

    expect(stateConnector).toBeInstanceOf(StateConnector);
  });

  it("can use reducers", () => {
    stateConnector.useReducer(reducer);

    expect(stateConnector.actionCreators).toMatchObject(reducer.actionCreators);
    expect(stateConnector.stateFilters.length).toBe(2);
    expect(
      stateConnector.stateFilters[
        stateConnector.stateFilters.length - 1
      ].keys.includes("jest")
    ).toBe(true);
  });

  it("can be connected to React component", () => {
    const connectedComponent = stateConnector.connectTo(JestComponent);

    expect(connectedComponent.displayName).toBe(
      `Connect(${JestComponent.name})`
    );
  });
});
