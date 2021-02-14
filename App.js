/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './components/reducer/index';
import AuthProvider from './navigation';

const store = createStore(Reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider />
    </Provider>
  );
};

export default App;
