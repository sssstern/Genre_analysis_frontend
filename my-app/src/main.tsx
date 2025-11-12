import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Важно: Импорт стилей, если они есть
import 'bootstrap/dist/css/bootstrap.min.css'; 
// import './index.css'; 
import './styles/main.css'; 
import './styles/genre.css'; 
import './styles/analysis.css';
import backImg from './img/back.jpg';
import homeImg from './img/Home.png';
import requestImg from './img/RequestIcon.png';
import searchImg from './img/Search.png';
import defaultImg from './img/Default.png';
console.log(backImg, homeImg, requestImg, searchImg, defaultImg);

import { Provider } from 'react-redux';
import store from './store.ts'; // Импорт store

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
// В конце main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Genre_analysis_frontend/sw.js');
  });
}