import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
import { fetchGenreDetails, type FullGenreDetails, clearGenreDetails } from '../store/genreSlice'; 

import CartIcon from '../components/CartIcon';
import Header from '../components/Header';

interface RootState {
    genre: {
        currentGenre: FullGenreDetails | null;
        loadingDetails: boolean;
        error: string | null;
    };
    auth: {
        isAuthenticated: boolean;
    };
}


const GenreDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const genreId = id ? parseInt(id, 10) : null;
    
    const loading = useAppSelector((state: RootState) => state.genre.loadingDetails);
    const genre = useAppSelector((state: RootState) => state.genre.currentGenre);
    const error = useAppSelector((state: RootState) => state.genre.error);

    useEffect(() => {
        if (genreId) {
            dispatch(fetchGenreDetails(genreId) as any); 
        } else {
            dispatch(clearGenreDetails());
        }
    }, [genreId, dispatch]);
    
    if (!genreId) {
        return <div className="container"><Header /><main className="main-content"><h1 style={{color: 'red'}}>Не указан ID услуги.</h1></main></div>;
    }

    if (loading) return <div>Загрузка деталей услуги...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка загрузки: {error}</div>;
    
    if (!genre || genre.GenreID !== genreId) return <div style={{ color: 'red' }}>Услуга не найдена.</div>;

    return (
        <div className="container">
            <Header />
            <CartIcon />
            
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