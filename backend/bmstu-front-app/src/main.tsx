import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Импортируем Redux store

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <Provider store={store}>  {/* Оборачиваем приложение в Provider */}
    <App/>
    </Provider>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("BMSTU-Sport-Frontend/serviceWorker.js")
        .then((registration) => {
            console.log('Service Worker зарегистрирован: ', registration);
        })
        .catch((error) => {
            console.error('Service Worker не зарегистрирован: ', error);
        });
    })
  }
