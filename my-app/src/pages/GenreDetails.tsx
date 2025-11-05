import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon'; 
import Header from '../components/Header';
import { mockGenres } from '../mockData'; 
import { refreshStatus } from '../store/cartStore'; 


const API_BASE_URL = '/api/v1/genres/'; 
const ADD_TO_ANALYSIS_URL = '/analysis/add-genre'; 

const GenreDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [genre, setGenre] = useState<Genre | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const mockGenre = mockGenres[0] || null; 

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);
        
        fetch(`${API_BASE_URL}${id}`) 
            .then(res => {
                if (!res.ok) {
                    console.error(`Ошибка сети при загрузке жанра: статус ${res.status}. Используем mock-данные.`);
                    setGenre(mockGenre); 
                    throw new Error(`Ошибка сети: статус ${res.status}. Отображены запасные данные.`);
                }
                return res.json();
            })
            .then(data => {
                const genreData = data.data || data; 
                
                if (genreData && genreData.GenreID) {
                    setGenre(genreData as Genre);
                } else {
                    console.error("Неверный формат данных от сервера. Используем mock-данные.");
                    setGenre(mockGenre); 
                    throw new Error("Неверный формат данных от сервера. Отображены запасные данные.");
                }
            })
            .catch(err => {
                if (mockGenre) {
                    console.error("Критическая сетевая ошибка. Возврат к mock-данным.", err);
                    setGenre(mockGenre);
                }
                setError(err.message);
                console.error("Ошибка при загрузке деталей жанра:", err);
            })
            .finally(() => setLoading(false));

    }, [id, mockGenre]); 
    const handleAddToAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!genre) return;
        
        setSuccessMessage(null);
        setError(null);
        
        const formData = new URLSearchParams();
        formData.append('genre_id', genre.GenreID.toString());
        formData.append('comment_to_request', '');
        formData.append('probability', '0');

        try {
            const response = await fetch(ADD_TO_ANALYSIS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                credentials: 'include', 
            });

            if (response.ok) {
                setSuccessMessage(`Услуга "${genre.GenreName}" успешно добавлена в заявку!`);
                refreshStatus();
            } else {
                const errorText = await response.text();
                setError(`Не удалось добавить услугу в заявку: ${errorText}`);
            }
        } catch (err) {
            // Ошибка сети
            setError('Ошибка сети при попытке добавить услугу в заявку.');
        }
    };

    if (loading) return <div>Загрузка деталей услуги...</div>;
    if (!genre) return <div style={{ color: 'red' }}>Услуга не найдена.</div>;

    return (
        <div className="container">
        <Header />
      
        <footer>
          <CartIcon />
         </footer>
      
            
            <div className="genre-adress">
                <Link to="/" className="adress-text" style={{ textDecoration: 'none' }}> 
                    Главная/
                </Link>
                <Link to="/genres" className="adress-text"> 
                    Услуги/
                </Link>
                <span className="adress-text" style={{ textDecoration: 'none', color: '#000000' }}> 
                    {genre.GenreName}
                </span>
            </div>

            <main className="genre-main">
                <div className="genre-content">
                    <div className="genre-info">
                        <h2 className="genre-subtitle">{genre.GenreName}</h2>
                        <div className="keywords-section">
                            <p className="card-keywords" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                                Маркерные слова: **{genre.GenreKeywords || 'Нет данных'}**
                            </p>
                        </div>
                        
                        
                        {error && (
                            <p style={{ color: 'orange', marginTop: '10px', fontSize: '14px' }}>
                                {error}
                            </p>
                        )}
                        
                        
                        {successMessage && (
                            <p style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
                                {successMessage}
                            </p>
                        )}

                        
                        <form onSubmit={handleAddToAnalysis}>
                            <button type="submit" className="add-to-analysis-btn" style={{marginTop: '20px'}}>
                                Добавить в заявку
                            </button>
                        </form>

                    </div>
                    <div className="genre-image">
                        <img src={genre.GenreImageURL || '/img/Default.png'} alt={genre.GenreName} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GenreDetails;