import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Новая главная страница
import GenreList from './pages/GenreList'; 
import GenreDetails from './pages/GenreDetails'; 
import AnalysisRequest from './pages/AnalysisRequest'; 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/genres" element={<GenreList />} />

        <Route path="/genres/:id" element={<GenreDetails />} />
        
        <Route path="/genreanalysisrequest/:id" element={<AnalysisRequest />} />
        
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;