import React, { useEffect, useMemo, useState } from 'react'; 
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header'; 
import { RootState } from '../store/index'; 
import GenreItem from '../components/GenreItem'; 
import { 
    fetchAnalysisRequest, 
    deleteAnalysisRequest, 
    submitAnalysisRequest,
    updateAnalysisText,
} from '../store/cartSlice'; 


const AnalysisRequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const requestID = Number(id);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentRequest, loading, error } = useSelector((state: RootState) => state.cart);
    
    const [analysisText, setAnalysisText] = useState('');

    const isDraft = useMemo(() => {
        // 🛑 ИСПРАВЛЕНИЕ: 'Draft' заменено на 'черновик'
        return currentRequest?.AnalysisRequestStatus === 'черновик'; 
    }, [currentRequest]);

    useEffect(() => {
        if (currentRequest && currentRequest.TextToAnalyse) {
             setAnalysisText(currentRequest.TextToAnalyse);
        }
        if (!currentRequest) {
            setAnalysisText('');
        }
    }, [currentRequest]);

    useEffect(() => {
        if (!requestID || isNaN(requestID)) {
            navigate('/genres');
            return;
        }
        dispatch(fetchAnalysisRequest(requestID) as any);
    }, [dispatch, requestID, navigate]);

    const handleSaveText = async () => {
        if (!currentRequest || !isDraft || loading || analysisText.trim() === currentRequest.TextToAnalyse.trim()) return;

        const resultAction = await dispatch(updateAnalysisText({ 
            requestID: requestID, 
            text: analysisText 
        }) as any); 
        if (updateAnalysisText.rejected.match(resultAction)) {
        }
    };

    const handleSubmitRequest = async () => {
        if (!currentRequest || !isDraft || loading) return;
        
        const resultAction = await dispatch(submitAnalysisRequest(requestID) as any);
        
        if (submitAnalysisRequest.rejected.match(resultAction)) {
            // Ошибка будет отображена через Redux
        } else {
            navigate('/genres'); 
        }
    };

    // ОБРАБОТЧИК УДАЛЕНИЯ ВСЕЙ ЗАЯВКИ
    const handleDeleteRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRequest || !isDraft || loading) return;
        
        const resultAction = await dispatch(deleteAnalysisRequest(requestID) as any); 

        if (deleteAnalysisRequest.rejected.match(resultAction)) {
            // Ошибка будет отображена через Redux
        } else {
            navigate('/genres'); 
        }
    };
    
    
    if (loading && !currentRequest) return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Загрузка заявки...</h1></main></div>;
    if (error && !currentRequest) return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Ошибка</h1><p style={{ color: 'red' }}>{error}</p></main></div>;
    if (!currentRequest) return <div className="container"><Header /><main className="main-content"><h1 className="page-title">Заявка не найдена</h1></main></div>;


    return (
        <div className="container">
            <Header />
            <main className="main-content">
            <div className="genre-adress">
                <Link to="/" className="adress-text" style={{ textDecoration: 'none' }}>Главная/</Link>
                <Link to="/genres" className="adress-text">Услуги/</Link>
                <span className="adress-text" style={{ textDecoration: 'none', color: '#000000' }}>Заявка №{requestID}</span>
            </div>
                <h1 className="page-title">
                    Составление заявки 
                </h1>
                
            <div className="search-section">
                <div className="search-label">Текст для анализа</div>
                <div className="search-container">
                    <textarea 
                        className="search-input scrollable-textarea" 
                        placeholder={isDraft ? "Заполнить текст" : "Текст для анализа"} 
                        rows={5}
                        value={analysisText}
                        onChange={(e) => setAnalysisText(e.target.value)}
                        readOnly={!isDraft}
                    />
                    {isDraft && (
                        <button 
                        className="save-button"
                            type="button"     
                            onClick={handleSaveText}
                            disabled={loading || analysisText.trim() === currentRequest.TextToAnalyse.trim()} 
                        >
                            Сохранить текст
                        </button>
                    )}
                </div>
            </div>
                
            <div className="analysis-list">
                {currentRequest.Genres.length > 0 ? (
                    currentRequest.Genres.map((item, index) => (
                        <GenreItem 
                            key={item.GenreID || index} 
                            item={item}
                            isDraft={isDraft} 
                            requestID={requestID}
                        />
                    ))
                ) : (
                    <p>В заявке пока нет добавленных жанров. <Link to="/genres">Добавить</Link>.</p>
                )}
                
                {/* Кнопки действий (submit/delete) */}
                {isDraft && currentRequest.Genres.length > 0 && (
                    <div className="action-buttons">                
                    
                        <button 
                            className="submit-button" 
                            onClick={handleSubmitRequest}
                            disabled={loading}
                        >
                            Сформировать
                        </button>

                        <form onSubmit={handleDeleteRequest} className="delete-button-form">
                            <button type="submit" className="delete-button" disabled={loading}>Удалить заявку</button> 
                        </form>      
                    </div>
                )}
                {error && !loading && (
                    <p style={{ color: 'red', marginTop: '20px' }}>
                        **Ошибка действия:** {error}
                    </p>
                )}
            </div>
            </main>
        </div>
    );
};

export default AnalysisRequestPage;

