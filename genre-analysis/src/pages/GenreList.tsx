import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 

import { fetchAllGenres,  setSearchTerm,  type FullGenreDetails } from '../store/genreSlice'; 
import { addItemToCart, fetchCartStatus } from '../store/cartSlice'; 

import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';

interface RootState {
    genre: {
        list: FullGenreDetails[];
        loadingList: boolean;
        error: string | null;
        searchTerm: string; 
    };
    auth: {
        isAuthenticated: boolean;
    };
}


const GenreList: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const genres = useAppSelector((state: RootState) => state.genre.list ?? []);
    const loading = useAppSelector((state: RootState) => state.genre.loadingList);
    const error = useAppSelector((state: RootState) => state.genre.error);
    
    const appliedSearchTerm = useAppSelector((state: RootState) => state.genre.searchTerm); 
    
    const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

    const [inputTerm, setInputTerm] = useState(appliedSearchTerm); 

    const fetchGenres = useCallback((query: string) => {
        dispatch(fetchAllGenres(query) as any);
    }, [dispatch]);

    useEffect(() => {
        fetchGenres(appliedSearchTerm);
        
        if (isAuthenticated) {
            dispatch(fetchCartStatus() as any); 
        }
    }, [fetchGenres, isAuthenticated, dispatch, appliedSearchTerm]); 

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        dispatch(setSearchTerm(inputTerm));
        fetchGenres(inputTerm); 
    };

    const handleAddToCart = useCallback((genre: Genre) => {
        dispatch(addItemToCart({ genreID: genre.GenreID }) as any)
            .unwrap()
            .then(() => {
                dispatch(fetchCartStatus() as any); 
            })
            .catch((err: unknown) => { 
                const errorMessage = (err as { message?: string })?.message || String(err) || 'Неизвестная ошибка';
                alert(`Ошибка при добавлении в заявку: ${errorMessage}`);
            });
    }, [dispatch]);

    return (
        <div className="container">
            <Header />
            <CartIcon />
            
            <main className="main-content">
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
                                className="search-input"
                                placeholder="Введите текст для поиска"
                                value={inputTerm} 
                                onChange={handleSearchChange} 
                            />
                        </div>
                        <button type="submit" className="search-button-icon" disabled={loading}>
                            <img src="/src/img/Search.png" alt="Поиск" />
                        </button>
                    </form>
                </div>
                
                {error && (
                    <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>
                        Ошибка загрузки: {error}
                    </p>
                )}

                {loading ? (
                    <p style={{ marginTop: '20px', textAlign: 'center' }}>Загрузка...</p>
                ) : genres.length === 0 && !error ? (
                    <p style={{ marginTop: '20px', textAlign: 'center' }}>
                        Услуги по вашему запросу не найдены.
                    </p>
                ) : (
                    <div className="cards-container">
                        {genres.map((genre) => (
                            <GenreCard
                                key={genre.GenreID}
                                genre={genre as Genre} 
                                onAddToCart={() => handleAddToCart(genre as Genre)}
                                showAddButton={isAuthenticated}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GenreList;