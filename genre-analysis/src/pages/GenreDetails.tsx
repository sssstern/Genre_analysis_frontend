import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
import { 
    clearGenreDetails, 
    fetchDetailsPending, 
    fetchDetailsFulfilled, 
    fetchDetailsRejected,
} from '../store/genreSlice'; 

import api from '../api'; 
import { findMockGenreById } from '../mockData'; 

import CartIcon from '../components/CartIcon';
import Header from '../components/Header';


const GenreDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const genreId = id ? parseInt(id, 10) : null;
    
    const loading = useAppSelector(state => state.genre.loadingDetails);
    const genre = useAppSelector(state => state.genre.currentGenre);
    const error = useAppSelector(state => state.genre.error);

    const userRole = useAppSelector(state => state.auth.user?.Role);
    const isModerator = userRole === 'moderator';

    useEffect(() => {
        if (!genreId) {
            dispatch(clearGenreDetails());
            return;
        }
        
        const fetchDetails = async () => {
            dispatch(fetchDetailsPending()); 
            try {
                const response = await api.get(`/genres/${genreId}`);
                const genreData = response.data.data;
                dispatch(fetchDetailsFulfilled(genreData)); 

            } catch (err: any) {
                const fallbackGenre = findMockGenreById(genreId);

                if (fallbackGenre) {
                    dispatch(fetchDetailsFulfilled(fallbackGenre));
                } else {
                    const errorMessage = err.response?.data?.error;
                    dispatch(fetchDetailsRejected(errorMessage));
                }
            }
        };

        fetchDetails();

    }, [genreId, dispatch]);
    
    if (!genreId) {
        return <div className="container"><Header /><main className="genre-main">Неверный идентификатор услуги.</main></div>;
    }

    if (loading) return <div>Загрузка деталей услуги...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка загрузки: {error}</div>;
    
    if (!genre || genre.GenreID !== genreId) return <div style={{ color: 'red' }}>Услуга не найдена.</div>;

    return (
        <div className="container">
            <Header />
            
            {!isModerator && <CartIcon />}
            
            <div className="genre-adress">
                <Link to="/" className="adress-text">Главная/</Link>
                <Link to="/genres" className="adress-text">Услуги/</Link>
                <span className="adress-text" style={{ color: '#000000' }}>
                    {genre.GenreName}
                </span>
            </div>

            <main className="genre-main">
                <div className="genre-content">
                    <div className="genre-info">
                        <h2 className="genre-subtitle">{genre.GenreName}</h2>
                        <div className="keywords-section">
                            <p className="card-keywords" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                                Маркерные слова: {genre.GenreKeywords || 'Нет данных'}
                            </p>
                        </div>
                    </div>
                    <div className="genre-image">
                        <img src={genre.GenreImageURL || '/src/img/Default.png'} alt={genre.GenreName} />
                    </div> 
                </div>
            </main>
        </div>
    );
};

export default GenreDetails;