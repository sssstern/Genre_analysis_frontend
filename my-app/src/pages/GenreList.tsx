import React, { useState, useEffect, useCallback } from 'react';
import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon'; 
import Header from '../components/Header'; 
import { Link } from 'react-router-dom';
// 💡 ИМПОРТ MOCK-ДАННЫХ
import { mockGenres } from '../mockData';

const API_BASE_URL = '/api/v1/genres';

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
    
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [filterQuery, setFilterQuery] = useState<string>(''); 

  const fetchGenres = useCallback(async (searchQuery: string) => {
    setLoading(true);
    const url = searchQuery 
      ? `${API_BASE_URL}?searchbygenrename=${encodeURIComponent(searchQuery)}`
      : API_BASE_URL;

    try {
      const response = await fetch(url);
      
      // 🛑 ОБРАБОТКА ОШИБКИ СЕРВЕРА (например, 500)
      if (!response.ok) {
        setGenres(mockGenres);
      }
      
      const apiResponse = await response.json();
      const genresArray = apiResponse.data;

      if (Array.isArray(genresArray)) {
          setGenres(genresArray as Genre[]);
      } else {
          // Неверный формат ответа, но бэкенд жив. 
          // Если бэкенд жив, не используем mock, чтобы не скрыть проблему.
          setGenres([]); 
          console.error("API response is not an object with a 'data' array:", apiResponse); 
          throw new Error("Неверный формат данных от сервера. Ожидался массив услуг в поле 'data'.");
      }
    } catch (e) {
      // 🛑 ОБРАБОТКА СЕТЕВОЙ ОШИБКИ (бэкенд не запущен)
      if (e instanceof Error) {
        // Если ошибка произошла не из-за response.ok (например, Network Error при неработающем бэкенде)
        if (!e.message.includes('статус')) {
            setGenres(mockGenres);
            setLoading(false);
            return;
        }
      } else {
      }
      // Если запрос был с поиском, mock-данные не используются
      if (!searchQuery) {
          setGenres(mockGenres);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres(filterQuery);
  }, [filterQuery, fetchGenres]); 

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
    
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFilterQuery(searchTerm);
  };
  
  return (
    <div className="container"> 
        <Header />
      
        <footer>
          <CartIcon />
         </footer>
      
        <main>
            <div className="main-content">
                {/* Хлебные крошки */}
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
                    {/* 1. Шапка поиска (Сверху) */}
                    <div className="search-label">Поиск по жанрам</div>
                    
                    {/* 2. Форма для поля ввода и кнопки (Ниже, в ряд) */}
                    <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
                        {/* Контейнер поля ввода занимает всю доступную ширину */}
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
                        
                        {/* Кнопка поиска */}
                        <button type="submit" className="search-button-icon">
                            <img src="/src/img/Search.png" alt="Поиск" />
                        </button>
                  </form>
                </div>

              {loading && <p style={{ marginTop: '20px' }}>Загрузка услуг...</p>}

              <div className="cards-container">
                {/* Рендерим карточки независимо от ошибки, если genres не пуст (т.е. содержит mock-данные) */}
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

