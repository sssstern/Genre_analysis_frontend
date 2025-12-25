import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './store/index';
import './styles/main.css'; 
import './styles/genre.css'; 
import './styles/analysis.css';

import Home from './pages/Home';
import GenreList from './pages/GenreList';
import GenreDetails from './pages/GenreDetails';
import AnalysisRequestPage from './pages/AnalysisRequest';
import Login from './pages/Login';
import Register from './pages/Register';
//import { fetchProfile } from './store/authSlice';

import AnalysisRequestList from './pages/AnalysisRequestList'; 
import UserProfile from './pages/UserProfile'; 
//basename="/Genre_analysis_frontend"
const App: React.FC = () => {


  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genres" element={<GenreList />} />
        <Route path="/genres/:id" element={<GenreDetails />} />
        <Route path="/genreanalysisrequest/:id" element={<AnalysisRequestPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/genreanalysisrequests" element={<AnalysisRequestList />} /> 
        <Route path="/profile" element={<UserProfile />} /> 
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);