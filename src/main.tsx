import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

const AppRoot = (
  <Provider store={store}>
    <App />
  </Provider>
);

root.render(
  import.meta.env.PROD
    ? <React.StrictMode>{ AppRoot }</React.StrictMode>
    : AppRoot
);
