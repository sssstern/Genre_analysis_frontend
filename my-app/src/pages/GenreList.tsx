import React, { useEffect, useCallback } from 'react';
import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { mockGenres } from '../mockData';
import { useDispatch, useSelector } from 'react-redux'; // Импорты из react-redux
import { setSearchTerm, setFilterQuery, selectSearchTerm, selectFilterQuery } from '../slices/filterSlice'; // Actions и selectors

const API_BASE_URL = '/api/v1/genres';

const GenreList: React.FC = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm); // Чтение из Redux
  const filterQuery = useSelector(selectFilterQuery); // Чтение из Redux
  
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

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
        throw new Error("Неверный формат данных от сервера.");
      }
    } catch (e) {
      if (!searchQuery) {
        setGenres(mockGenres);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres(filterQuery); // Используем filterQuery из Redux
  }, [filterQuery, fetchGenres]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value)); // Dispatch в Redux
  };
    
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setFilterQuery(searchTerm)); // При submit — обновляем filterQuery из searchTerm
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
                          value={searchTerm} // Значение из Redux
                          onChange={handleSearchChange}
                        />
                      </div>
          
                        <button type="submit" className="search-button-icon">
                            <img src="/img/Search.png" alt="Поиск" />
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