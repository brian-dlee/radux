# Radux
Radux is a helper library for react-redux. Hooking components up to a globally managed
state through Redux can be be somewhat tedious. Depending on the pattern you've chosen
for each Component you hook up to Redux you could be updating the reducer, the actions,
the container, and the component.

Radux aims to ease the process while enforcing some opiniated configuration so
Redux powered applications and their patterns/configurations are more recognizeable.

> _Caution: At this point I wouldn't recommend this package for beginners. This package
abstracts some of Redux and parts could feel like "magic" if you are not very familiar
with Redux. At this point, this package is intended for those of us that are more familiar
with Redux and want to reduce the configuration required to get running and hook new components
to the global state._

To reiterate, if you are not familiar with Redux you should first become familiar with how
Redux works.

## Installing Radux
We all know this part. To install Radux, use your favorite Node package manager.
```shell
npm install --save radux
```
## Exhibit A: The Redux model
**Create Actions**
```javascript
// src/redux/actions/app.js 
const MY_ACTION = 'myAction'; 

export {
  MY_ACTION,
};
```
**Create Action Creators**
```javascript
// src/redux/action-creators/app.js 
import MY_ACTION from "../actions/app";

const doMyAction = value => {
  return {
    type: MY_ACTION,
    value
  };
};

export {
  doMyAction
};
```
**Create Reducer**
```javascript
// src/redux/reducers/app.js 
import MY_ACTION from '../actions/app.js';

const initialState = {
  value: 1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MY_ACTION:
      return {...state, value: action.value}
    default:
      return state;
  }
}
```
**Expose Reducer**
```javascript
// src/redux/reducers/index.js 
import appReducer from "./app";

export {
  app: appReducer
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
      doMyAction: value => dispatch(actionCreators.doMyAction(value))
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
  render() {
    return (
      <div>
        <p>Value: {this.props.app.value}</p>
        <button onClick={this.props.actions.doMyAction(this.props.app.value + 1)}>
          Increment
        </button>
      </div>
    );
  }
}
````
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
  <Provider state={createStore(combinedReducers)}>
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
  .addAction("myAction", value => ({ value }),
    (state, action) => ({...state, value: action.value}))
```
**Expose Reducer**
```javascript
// src/reducers/index.js 
import appReducer from "./app";

export {
  app: appReducer
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

const connector = stateConnector();
connector.useReducer(appReducer);

class App extends Component {
  render() {
    return (
      <div>
        <p>Value: {this.props.app.value}</p>
        <button onClick={this.props.actions.app.myAction(this.props.app.value + 1)}>
          Increment
        </button>
      </div>
    );
  }
}

export default connector.connectTo(App);
```
**Hook reducers to the global state**
```javascript
// src/index.js 
import React from "react";
import { createStore, registerReducers } from "radux";
import { Provider } from "react-redux";
import * as myReducers from "./redux/reducers";
import App from "./AppContainer";

radux.registerReducers(myReducers);

ReactDom.render(
  <Provider state={radux.getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
## API Reference
To come...
