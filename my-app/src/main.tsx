import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Важно: Импорт стилей, если они есть
import 'bootstrap/dist/css/bootstrap.min.css'; 
// import './index.css'; 
import './styles/main.css'; 
import './styles/genre.css'; 
import './styles/analysis.css';

// Убедитесь, что элемент с ID 'root' существует
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
