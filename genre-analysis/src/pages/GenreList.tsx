import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
import {setSearchTerm, fetchListPending, fetchListFulfilled, fetchListRejected,type FullGenreDetails } from '../store/genreSlice'; 
import api from '../api'; 
import { mockGenres } from '../mockData'; 
import { addItemToCart, fetchCartStatus } from '../store/cartSlice'; 
import GenreCard, { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';


const GenreList: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const genres = useAppSelector(state => state.genre.list ?? []);
    const loading = useAppSelector(state => state.genre.loadingList);
    const error = useAppSelector(state => state.genre.error);
    const appliedSearchTerm = useAppSelector(state => state.genre.searchTerm); 
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const userRole = useAppSelector(state => state.auth.user?.Role); 
    const isModerator = userRole === 'moderator';
    
    const [inputTerm, setInputTerm] = useState(appliedSearchTerm);
    
    const fetchGenres = useCallback(async (query: string) => {
        const trimmedQuery = query && query.trim();
        dispatch(fetchListPending());
        
        try {
            const url = trimmedQuery
                ? `/genres?searchbygenrename=${encodeURIComponent(trimmedQuery)}`
                : '/genres';
                
            const response = await api.get(url);
            
            const genreData = response.data.data as FullGenreDetails[]; 
            dispatch(fetchListFulfilled(genreData));

        } catch (err: any) {
            const fallbackList = mockGenres.filter(g => 
                !trimmedQuery || (g.GenreName ?? '').toLowerCase().includes(trimmedQuery.toLowerCase())
            );
            if (fallbackList.length > 0) {
                dispatch(fetchListFulfilled(fallbackList as FullGenreDetails[])); 
            } else {
                const errorMessage = err.response?.data?.error;
                dispatch(fetchListRejected(errorMessage));
            }
        }
    }, [dispatch]);

    
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchTerm(inputTerm));
        fetchGenres(inputTerm); 
    }, [dispatch, inputTerm, fetchGenres]);

    const handleAddToCart = useCallback((genre: Genre) => {
        if (isAuthenticated) {
            dispatch(addItemToCart({ genreID: genre.GenreID }) as any)
                .then(() => {
                    dispatch(fetchCartStatus() as any); 
                });
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        fetchGenres(appliedSearchTerm); 
        
        if (isAuthenticated && !isModerator) {
            dispatch(fetchCartStatus() as any); 
        }
    }, [appliedSearchTerm, dispatch, fetchGenres, isAuthenticated, isModerator]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTerm(e.target.value);
    };


    return (
        <div className="container">
            <Header />
            
            {!isModerator && <CartIcon />}
            
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
                            <input type="text" className="search-input" placeholder="Введите текст для поиска" value={inputTerm} onChange={handleSearchChange} />
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
                            <GenreCard key={genre.GenreID} genre={genre as Genre} onAddToCart={() => handleAddToCart(genre as Genre)} showAddButton={isAuthenticated && !isModerator} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GenreList;