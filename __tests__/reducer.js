import Reducer from "../src/reducer";

describe("reducer", () => {
  let reducer;

  it("constructs", () => {
    reducer = new Reducer("jest", { v: 0 });

    expect(reducer).toBeInstanceOf(Reducer);
  });

  it("can have actions added", () => {
    reducer.addAction(
      "add",
      value => ({ value }),
      (state, action) => ({
        ...state,
        v: state.v + action.value
      })
    );

    expect(typeof reducer.actionCreators["jest/add"]).toBe("function");
  });
});
