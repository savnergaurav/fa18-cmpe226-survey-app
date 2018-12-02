import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk';

import reducer from './store/reducer';
const store = createStore(
    reducer,
    applyMiddleware(thunk)
  );


ReactDOM.render(
        <Provider store = {store}>
            <App />
      </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();
