import React, { useState, useEffect, useCallback } from 'react';
import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon'; 
import Header from '../components/Header'; 
import { Link } from 'react-router-dom';
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
      if (!response.ok) {
        setGenres(mockGenres);
      }
      
      const apiResponse = await response.json();
      const genresArray = apiResponse.data;

      if (Array.isArray(genresArray)) {
          setGenres(genresArray as Genre[]);
      } else {
          setGenres([]); 
          console.error("API response is not an object with a 'data' array:", apiResponse); 
          throw new Error("Неверный формат данных от сервера. Ожидался массив услуг в поле 'data'.");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (!e.message.includes('статус')) {
            setGenres(mockGenres);
            setLoading(false);
            return;
        }
      } else {
      }
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

              {loading && <p style={{ marginTop: '20px' }}>Загрузка услуг...</p>}

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

