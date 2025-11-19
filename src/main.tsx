// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // ← добавь
import store from './store';         // ← добавь
import './styles/main.css'; 
import './styles/genre.css'; 
import './styles/analysis.css';

import Home from './pages/Home';
import GenreList from './pages/GenreList';
import GenreDetails from './pages/GenreDetails';
import AnalysisRequestPage from './pages/AnalysisRequest';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/genres" element={<GenreList />} />
            <Route path="/genres/:id" element={<GenreDetails />} />
            <Route path="/genreanalysisrequest/:id" element={<AnalysisRequestPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);