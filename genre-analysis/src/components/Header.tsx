import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/authSlice';

const Header: React.FC = () => {
  
  const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated ?? false);
  const userLogin = useAppSelector(state => state.auth?.user?.Login ?? null);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header>
      <Link to="/"><img src="/src/img/Home.png" alt="home" /></Link>
      <nav className="header-nav">
        <Link to="/genres" className="nav-link">
          Список жанров
        </Link>
      </nav>
      <div className="header-nav-logreg">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="greetings">Привет, {userLogin}!</span>

              <Link to="/genreanalysisrequests" className="nav-link">
                Мои Заявки
              </Link>
              <Link to="/profile" className="nav-link">
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className="submit-button" 
              >
                Выйти
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Войти</Link>
              <Link to="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </div>
    </header>
  );
};





export default Header;