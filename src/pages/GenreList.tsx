// src/pages/GenreList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../store/filterSlice';
import { RootState } from '../store';
import { mockGenres } from '../mockData';

const API_BASE_URL = 'https://172.20.10.7:8443/api/v1/genres';

const GenreList: React.FC = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState<string>(''); // ← только по кнопке или при монтировании

  const fetchGenres = useCallback(async (query: string) => {
    setLoading(true);
    const url = query
      ? `${API_BASE_URL}?searchbygenrename=${encodeURIComponent(query)}`
      : API_BASE_URL;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const genresArray = data.data;

      if (Array.isArray(genresArray)) {
        setGenres(genresArray as Genre[]);
      } else {
        console.error('Invalid data format:', data);
        setGenres(mockGenres);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      setGenres(mockGenres);
    } finally {
      setLoading(false);
    }
  }, []);

  // Запрос ТОЛЬКО при изменении filterQuery
  useEffect(() => {
    fetchGenres(filterQuery);
  }, [filterQuery, fetchGenres]);

  // При монтировании: если в Redux есть сохранённый поиск — применяем ОДИН РАЗ
  useEffect(() => {
    if (searchTerm && filterQuery === '') {
      setFilterQuery(searchTerm.trim());
    }
  }, []); // ← ПУСТОЙ массив зависимостей! Выполняется ТОЛЬКО ПРИ МОНТИРОВАНИИ

  // Ввод — только в Redux, БЕЗ запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // ПОИСК ТОЛЬКО ПО КНОПКЕ
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterQuery(searchTerm.trim());
  };

  return (
    <div className="container">
      <Header />
      <CartIcon />
      <main>
        <div className="main-content">
          <div className="genre-adress">
            <Link to="/" className="adress-text" style={{ textDecoration: 'none' }}>
              Главная/
            </Link>
            <span className="adress-text" style={{ textDecoration: 'none', color: '#000000' }}>
              Услуги
            </span>
          </div>

          <h1 className="page-title">Анализ текста</h1>

          <div className="search-section">
            <div className="search-label">Поиск по жанрам</div>
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <div className="search-container">
                <input
                  type="text"
                  name="searchbygenrename"
                  className="search-input"
                  placeholder="Введите текст для поиска"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <button type="submit" className="search-button-icon">
                <img src="/src/img/Search.png" alt="Поиск" />
              </button>
            </form>
          </div>

          {loading && <p style={{ marginTop: '20px' }}>Загрузка...</p>}

          <div className="cards-container">
            {!loading && genres.map((genre) => (
              <GenreCard key={genre.GenreID} genre={genre} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenreList;