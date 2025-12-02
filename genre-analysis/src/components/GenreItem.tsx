// src/components/GenreItem.tsx

import React, { useState, useMemo, useEffect } from 'react'; // 🛑 Добавлен useEffect
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
    deleteItemFromRequest, 
    updateAnalysisGenreComment,
    FlatGenreItemWithAnalysis 
} from '../store/cartSlice'; 

interface GenreItemProps {
    item: FlatGenreItemWithAnalysis;
    isDraft: boolean; 
    requestID: number; 
}

const GenreItem: React.FC<GenreItemProps> = ({ item, isDraft, requestID }) => {
    const dispatch = useDispatch();
    
    // Логика изображений
    const [hasImageLoadError, setHasImageLoadError] = useState(false);
    const DEFAULT_IMAGE_PATH = '/src/img/Default.png'; 

    const primarySource = useMemo(() => {
        const url = item.GenreImageURL ? item.GenreImageURL.trim() : '';
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
             return url;
        }
        return DEFAULT_IMAGE_PATH;
    }, [item.GenreImageURL]);

    const imageSource = hasImageLoadError ? DEFAULT_IMAGE_PATH : primarySource;

    // ЛОКАЛЬНОЕ СОСТОЯНИЕ ДЛЯ КОММЕНТАРИЯ
    const [localComment, setLocalComment] = useState(item.CommentToRequest || '');

    // 🛑 ИСПРАВЛЕНИЕ: Синхронизация локального состояния с пропсами при их изменении.
    // Это гарантирует, что после успешного сохранения (и refetch) поле корректно обновится.
    useEffect(() => {
        setLocalComment(item.CommentToRequest || '');
    }, [item.CommentToRequest]);

    // Текстовый контент
    const keywordsText = item.GenreKeywords || 'Нет данных';
    let probabilityText = 'Нет данных';
    if (item.ProbabilityPercent !== undefined && item.ProbabilityPercent !== null) {
        probabilityText = `${item.ProbabilityPercent} %`;
    }
    
    const handleSaveComment = async (e: React.FormEvent) => {
        e.preventDefault(); 
        if (!isDraft || !localComment.trim()) return; 
        const resultAction = await dispatch(updateAnalysisGenreComment({ 
            itemID: item.GenreID, 
            requestID: requestID, 
            comment: localComment.trim() 
        }) as any); 
        if (updateAnalysisGenreComment.rejected.match(resultAction)) {
            // Ошибка будет отображена на странице AnalysisRequestPage через Redux
        }
    };

    // ОБРАБОТЧИК УДАЛЕНИЯ УСЛУГИ
    const handleDeleteGenre = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDraft) return; 
        
        const resultAction = await dispatch(deleteItemFromRequest({ 
            requestID: requestID, 
            itemID: item.GenreID 
        }) as any); 

        if (deleteItemFromRequest.rejected.match(resultAction)) {
             // Ошибка будет отображена на странице AnalysisRequestPage через Redux
        }
    };

    return (
        <div className="genre-item">
            <div className="genre-image-analysis"> 
                <img 
                    src={imageSource} 
                    alt={`Изображение жанра ${item.GenreName}`} 
                    onError={() => setHasImageLoadError(true)}
                />
            </div>
            <div className="genre-content-analysis">
                <p className="card-title">{item.GenreName}</p>
                <p className="card-keywords-analysis">
                    Маркерные слова: {keywordsText}
                </p>
                <Link to={`/genres/${item.GenreID}`} className="details-link">Подробнее</Link>
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
                <form onSubmit={handleSaveComment} className="comment-form-wrapper">
                    <input 
                        type="text" 
                        className="comment-input" 
                        placeholder={isDraft ? "Введите ваш комментарий" : "Комментарий"} 
                        value={localComment} 
                        onChange={(e) => setLocalComment(e.target.value)}
                        readOnly={!isDraft}
                    />
                    {isDraft && (
                        <button 
                            type="submit" 
                            className="save-comment-button" 
                            // 🛑 Проверка: Отключаем, если пустое (с trim) или равно сохраненному значению
                            disabled={!localComment.trim() || item.CommentToRequest === localComment.trim()} 
                        >
                            Сохранить
                        </button>
                    )}
                </form>
            </div>
            {isDraft && (
                <form onSubmit={handleDeleteGenre}>
                    <button type="submit" className="delete-icon"> 
                        <img src="/src/img/Garbage.png" alt="Удалить" />
                    </button>
                </form>
            )}
        </div>
    );
};

export default GenreItem;