import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import Routes from "../routes";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import RootReducers from "../reducers";
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger();
const middleware = applyMiddleware(thunk, loggerMiddleware);

const store = createStore(RootReducers, window.INITIAL_STATE, middleware);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>{renderRoutes(Routes)}</BrowserRouter>
      </Provider>
    );
  }
}

export default App;
