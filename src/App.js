import React, { useEffect } from 'react';

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import router from './Router';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <RouterProvider router={router} />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
