# Radux
Radux is a helper library for react-redux. Hooking components up to a globally managed
state through Redux can be be somewhat tedious. Depending on the pattern you've chosen
for each Component you hook up to Redux you could be updating the reducer, the actions,
the container, and the component.

Radux aims to ease the process while enforcing some opiniated configuration so
Redux powered applications and their patterns/configurations are more recognizeable.

> _Caution: At this point I wouldn't recommend this package for beginners. This package
> abstracts some of Redux and parts could feel like "magic" if you are not very familiar
> with Redux. At this point, this package is intended for those of us that are more familiar
> with Redux and want to reduce the configuration required to get running and hook new components
> to the global state._

To reiterate, if you are not familiar with Redux **you should first become familiar with how
Redux works before using this package**.

## Changelog
### v0.6.0
> **Caution: Includes breaking changes (see below)**

#### Feature additions
1. Implemented named stores to allow the splitting of stores into smaller pieces
2. Implemented retrieval of stores to manually dispatch actions

This is especially usable in cases of Middleware actions (e.g. react-router-redux)
Added helper method "dispatch" which accepts an optional store name and an action
In react-router-redux, the following snippet can be used to programmatically navigate

```javascript
import radux from 'radux';
import { push } from 'react-router-redux'; //react-router-redux@next (currently in alpha)

radux.dispatch(push('/myPath'))
// or
radux.getStore().dispatch(push('/myPath'))

// or for named stores

radux.dispatch('special', push('/myPath'))
// or
radux.getStore('special').dispatch(push('/myPath'))
```

#### Breaking changes
- `getStore` now only takes a single argument "storeName"
  - use `addStore` for the old functionality of `getStore`; this can actually
  replace your old `getStore` calls
  - use `addNamedStore` to implement multiple stores
- `registerGlobalActionCreators` has been changed to `registerGlobalReducer` where a reducer should be supplied

#### Bug fixes
- sending in enhancers or middleware into `addStore` (previously `getStore`) should now work where it did not previously build Redux store correctly
- Adjusted filter check for String filters (named filters); specifically the "permissive" filter

## Installing Radux
We all know this part. To install Radux, use your favorite Node package manager.
```shell
npm install --save radux
// or
yarn add radux
```
## Exhibit A: The Redux model
**Create Actions**
```javascript
// src/redux/actions/app.js 
const ADD = 'app/add'; 

export {
  ADD,
};
```
**Create Action Creators**
```javascript
// src/redux/action-creators/app.js 
import ADD from "../actions/app";

const doAdd = value => {
  return {
    type: ADD,
    value
  };
};

export {
  doAdd
};
```
**Create Reducer**
```javascript
// src/redux/reducers/app.js 
import ADD from '../actions/app.js';

const initialState = {
  value: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      return {...state, value: state.value + action.value}
    default:
      return state;
  }
}
```
**Expose Reducer**
```javascript
// src/redux/reducers/index.js 
import app from "./app";

export {
  app
};
```
**Create container to map state and dispatchers to Component**
```javascript
// src/AppContainer.js
import { bindActionCreators, connect } from "redux";
import App from "./App";
import * as actionCreators from "./redux/action-creators/app"

const mapStateToProps = state => {
  return { app: state.app };
};

const mapDispatchToProps = dispatch => {
  return { 
    actions: {
      doAdd: value => dispatch(actionCreators.doAdd(value))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```
**Write your component**
```javascript
// src/App.js 
import React, { Component }  from "react";

export default class App extends Component {
  increment = () => this.props.actions.doAdd(1);
  render() {
    return (
      <div>
        <p>Value: {this.props.app.value}</p>
        <button onClick={this.increment}>
          Increment
        </button>
      </div>
    );
  }
}
```
**Hook reducers to the global state**
```javascript
// src/index.js 
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import * as myReducers from "./redux/reducers";
import AppContainer from "./AppContainer";

const combinedReducers = combinedReducers(myReducers);

ReactDom.render(
  <Provider store={createStore(combinedReducers)}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
```
## Exhibit B: The Radux model
**Create Action, Reducer, and Action Creators**

These are now all included in the Reducer
```javascript
// src/reducers/app.js 
import { reducer } from "redux";

const initialState = {
  value: 0
};

export default reducer("app", initialState)
  .addAction("add", value => ({ value }),
    (state, action) => ({...state, value: state.value + action.value}))
```
**Expose Reducer**
```javascript
// src/reducers/index.js 
import app from "./app";

export {
  app
};
```
**Write your component**

No need for the container anymore. Most of the logic has been moved to reducer, so the job of the component
is not handled by just a couple lines.
```javascript
// src/App.js 
import { stateConnector } from "radux";
import React, { Component }  from "react";

import appReducer from "./reducers/app";

class App extends Component {
  increment = () => this.props.actions.app.add(1);
  render() {
    return (
      <div>
        <p>Value: {this.props.app.value}</p>
        <button onClick={this.increment}>
          Increment
        </button>
      </div>
    );
  }
}

export default stateConnector()
  .useReducer(appReducer)
  .connectTo(App);
```
**Hook reducers to the global state**
```javascript
// src/index.js 
import React from "react";
import radux from "radux";
import { Provider } from "react-redux";
import myReducers from "./reducers";
import App from "./AppContainer";

ReactDom.render(
  <Provider store={radux.getStore(myReducers)}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
## API Reference
To come...
