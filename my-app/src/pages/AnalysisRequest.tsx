import React, { useState, useEffect, useMemo } from 'react'; // 🛑 ВАЖНО: Импортируем useState и useMemo
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import type { AnalysisRequestData, FlatGenreItem } from '../types'; 

import Header from '../components/Header'; 

const API_BASE_URL = '/api/v1/text-analysis-requests'; 

// --- Вспомогательный компонент для отображения одного жанра ---
const GenreItem: React.FC<{ item: FlatGenreItem; index: number }> = ({ item, index }) => {
    
    // 🛑 ИСПРАВЛЕНИЕ: Добавляем состояние для отслеживания ошибки загрузки изображения
    const [hasImageLoadError, setHasImageLoadError] = useState(false);
    
    const DEFAULT_IMAGE_PATH = '/src/img/Default.png'; 

    // Используем useMemo для определения источника изображения
    const primarySource = useMemo(() => {
        // Убедимся, что URL из API используется, только если он выглядит как полный URL
        // (например, содержит "http" или "/").
        const url = item.GenreImageURL ? item.GenreImageURL.trim() : '';
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
             // Используем URL из API, если он не пуст
             return url;
        }
        // В противном случае, сразу используем дефолтный путь.
        return DEFAULT_IMAGE_PATH;
    }, [item.GenreImageURL]);


    // Источник, который будет использоваться в теге <img>
    // Если произошла ошибка, принудительно устанавливаем дефолтный путь.
    const imageSource = hasImageLoadError ? DEFAULT_IMAGE_PATH : primarySource;

    // Обработка остальных полей
    const keywordsText = item.GenreKeywords || 'Нет данных';
    let probabilityText = 'Нет данных';
    if (item.ProbabilityPercent !== undefined && item.ProbabilityPercent !== null) {
        probabilityText = `${item.ProbabilityPercent} %`;
    }
    const commentText = item.CommentToRequest || ''; 

    const handleDeleteGenre = async (e: React.FormEvent) => {
        e.preventDefault();
        // ID для удаления - это AnalysisGenreID, который, по предположению, находится в item.GenreID.
        // Если API ожидает AnalysisGenreID, его нужно использовать. 
        // Если ID для удаления - это ID записи в списке (AnalysisGenreID), а не ID жанра (GenreID):
        // Предполагаем, что вам нужен ID записи в заявке, которого нет в FlatGenreItem. 
        // Если ID записи в заявке совпадает с item.GenreID, используем его:
        const deleteId = item.GenreID; 

        try {
            const response = await fetch(`/api/v1/analysis-genre/${deleteId}`, {
                method: 'DELETE', // Используем DELETE
                credentials: 'include',
            });

            if (response.ok) {
                // Перезагрузка страницы, чтобы обновить список
                window.location.reload(); 
            } else {
                const errorText = await response.text();
                alert(`Не удалось удалить услугу: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            alert('Ошибка сети при попытке удаления услуги.');
        }
    };

    return (
        <div className="genre-item">
            <div className="genre-image-analysis"> 
                {/* 🛑 ИСПРАВЛЕНИЕ: Используем imageSource и обработчик, который меняет только state */}
                <img 
                    src={imageSource} 
                    alt={`Изображение жанра ${item.GenreName}`} 
                    onError={() => {
                        // Если произошла ошибка, устанавливаем state.
                        // Если state уже true, то повторного рендера не будет, и цикл прервется.
                        setHasImageLoadError(true);
                    }}
                />
            </div>
            <div className="genre-content-analysis">
                <p className="card-title">{item.GenreName}</p>
                <p className="card-keywords-analysis">
                    Маркерные слова: {keywordsText}
                </p>
                <a href={`/genres/${item.GenreID}`} className="details-link">Подробнее</a>
            </div>
            <div className="probability-section">
                <p className="price">Вероятность принадлежности текста к этому жанру:</p>
                <div className="probability-input">
                    <input 
                        type="text" 
                        placeholder="Поле ответа" 
                        value={probabilityText} 
                        readOnly 
                    />
                </div>
            </div>
            <div className="comment-section">
                <input 
                    type="text" 
                    className="comment-input" 
                    placeholder="Ваш комментарий" 
                    value={commentText} 
                    readOnly 
                />
            </div>
            <form onSubmit={handleDeleteGenre} className="delete-icon-form">
                <button type="submit" className="delete-icon"> 
                    <img src="/src/img/Garbage.png" alt="Удалить" />
                </button>
            </form>
        </div>
    );
};
// -----------------------------------------------------------------


const AnalysisRequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const analysisId = id ? parseInt(id, 10) : 0;

    const [requestData, setRequestData] = useState<AnalysisRequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!analysisId) {
            setError('ID заявки не указан в URL.');
            setLoading(false);
            return;
        }

        const fetchRequest = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/${analysisId}`, {
                    credentials: 'include', 
                });

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки данных: ${response.status}. Возможно, заявка не найдена.`);
                }

                const rawData = await response.json();
                const data = rawData.data || rawData;
                
                const genresArray = data.Genres;

                const processedData: AnalysisRequestData = {
                    AnalysisRequestID: data.AnalysisRequestID,
                    TextToAnalyse: data.TextToAnalyse,
                    AnalysisRequestStatus: data.AnalysisRequestStatus,
                    CreatedAt: data.CreatedAt,
                    CreatorLogin: data.CreatorLogin,
                    Genres: genresArray || [], 
                };

                setRequestData(processedData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка при загрузке заявки.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [analysisId]);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestData) return;

        try {
            const response = await fetch('/api/v1/text-analysis-requests', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `analysis_request_id=${requestData.AnalysisRequestID}`,
                credentials: 'include',
            });
            
            if (response.ok) {
                navigate('/genres'); 
            } else {
                alert('Не удалось удалить заявку.');
            }
        } catch (error) {
            alert('Ошибка сети при попытке удаления заявки.');
        }
    };

    const handleFormRequest = async () => {
        if (!requestData) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${requestData.AnalysisRequestID}/form`, {
                method: 'PUT', // Используем PUT для формирования заявки
                credentials: 'include',
            });

            if (response.ok) {
                alert(`Заявка ${requestData.AnalysisRequestID} успешно сформирована.`);
                // Перезагрузка данных для отображения нового статуса
                // (Или просто reload, если API не возвращает новый статус сразу)
                window.location.reload(); 
            } else {
                const errorText = await response.text();
                alert(`Не удалось сформировать заявку: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            alert('Ошибка сети при попытке формирования заявки.');
        }
    };

    if (loading) {
        return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Загрузка заявки...</h1></main></div>;
    }

    if (error) {
        return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Ошибка</h1><p style={{ color: 'red' }}>{error}</p></main></div>;
    }
    
    if (!requestData) {
         return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Заявка не найдена</h1></main></div>;
    }


    return (
        <div className="container">
            <Header />
            <main className="main-content">
            {/* ДОБАВЛЕННЫЕ ХЛЕБНЫЕ КРОШКИ */}
            <div className="genre-adress">
                <Link to="/" className="adress-text" style={{ textDecoration: 'none' }}>
                    Главная/
                </Link>
                <Link to="/genres" className="adress-text">
                    Услуги/
                </Link>
                <span className="adress-text" style={{ textDecoration: 'none', color: '#000000' }}>
                    Заявка №{analysisId}
                </span>
            </div>
            {/* КОНЕЦ ХЛЕБНЫХ КРОШЕК */}
                <h1 className="page-title">Составление заявки</h1>
                
                <div className="search-section">
                    <div className="search-label">Текст для анализа</div>
                    <div className="search-container">
                        <textarea 
                            className="search-input scrollable-textarea" 
                            placeholder="Заполнить текст" 
                            rows={5}
                            value={requestData.TextToAnalyse}
                            readOnly 
                        />
                    </div>
                </div>
                
                <div className="analysis-list">
                    {requestData.Genres.length > 0 ? (
                        requestData.Genres.map((item, index) => (
                            <GenreItem key={item.GenreID || index} item={item} index={index} />
                        ))
                    ) : (
                        <p>В заявке пока нет добавленных жанров.</p>
                    )}
                    
                    <div className="action-buttons">                
                    
                        <button 
                            className="submit-button" 
                            onClick={handleFormRequest}
                            // Добавим className submit-button, который обычно стилизуется
                        >
                            Сформировать
                        </button>

                        <form onSubmit={handleDelete} className="delete-button-form"> {/* Переименуем класс формы для ясности */}
                            <input 
                                type="hidden" 
                                id="analysis-request-id" 
                                name="analysis_request_id" 
                                value={requestData.AnalysisRequestID} 
                            />
                            <button type="submit" className="delete-button">Удалить заявку</button> 
                        </form>      
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AnalysisRequestPage;