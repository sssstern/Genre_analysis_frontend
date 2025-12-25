import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
import { 
    fetchAnalysisRequestList, 
    processAnalysisRequest, 
    type FilterParams 
} from '../store/analysisRequestSlice';
import { type AnalysisRequest } from '../store/cartSlice'; 

const POLLING_INTERVAL = 10000; 

const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getNextDayString = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day)); 
    date.setDate(date.getDate() + 1);

    const nextYear = date.getUTCFullYear();
    const nextMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
    const nextDay = String(date.getUTCDate()).padStart(2, '0');
    
    return `${nextYear}-${nextMonth}-${nextDay}`;
};
// ---------------------------------------------------------------------

// --- Вспомогательный компонент для отображения одной заявки ("полоска") ---
interface RequestStripProps {
    request: AnalysisRequest;
    isModerator: boolean; 
    onStatusChange: (requestID: number, action: 'reject' | 'complete') => void; 
}

const RequestStrip: React.FC<RequestStripProps> = ({ request, isModerator, onStatusChange }) => {
    const firstGenre = request.Genres[0];
     
    const completedGenres = request.genres_completed_count || 0; 
    
    const isCompleted = request.AnalysisRequestStatus?.toLowerCase() === 'завершён';
    const isRejected = request.AnalysisRequestStatus?.toLowerCase() === 'отклонён';
    const isReadyToProcess = request.AnalysisRequestStatus?.toLowerCase() === 'сформирован'; 
    
    const getSnippet = (text: string, length: number = 150): string => {
        if (!text) return 'Нет текста для анализа';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };
        
    const formatStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'сформирован': return 'Сформирована';
            case 'завершён': return 'Завершена';
            case 'отклонён': return 'Отклонена';
            case 'черновик': return 'Черновик';
            default: return status;
        }
    };
    
    const statusColor = isCompleted ? '#990000' : (request.AnalysisRequestStatus?.toLowerCase() === 'отклонён' ? '#999' : '#555');

    return (
        <div 
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                borderBottom: '1px solid #ddd', 
                backgroundColor: '#fff' 
            }}
        >
            {/* Основная полоса (ссылка) */}
            <Link 
                to={`/genreanalysisrequest/${request.AnalysisRequestID}`} 
                style={{ 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'flex', 
                    alignItems: 'flex-start', // Выравнивание по верхнему краю (как было)
                    padding: '15px 20px', 
                    minHeight: '120px', 
                    gap: '60px', // Уменьшен отступ для новой колонки
                    width: '100%',
                }} 
            >
                
                {/* 1. КАРТИНКА */}
                <div style={{ width: '80px', height: '80px', flexShrink: 0, marginTop: '5px' }}>
                    <img 
                        src={firstGenre?.GenreImageURL || '/src/img/Default.png'}
                        alt={firstGenre?.GenreName || 'Заявка'}
                        style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            border: '1px solid #eee' 
                        }}
                    />
                </div>
                
                {/* 2. НОМЕР ЗАЯВКИ И СТАТУС */}
                <div style={{ width: '130px', flexShrink: 0, paddingTop: '5px' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>Заявка №{request.AnalysisRequestID}</h3>
                    {isModerator && (
                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#333' }}>
                            Создатель: <strong style={{ fontWeight: 'normal' }}>{request.CreatorLogin}</strong>
                        </p>
                    )}
                    <p style={{ margin: 0, fontSize: '1em', color: '#555' }}>
                        Статус: 
                        <strong style={{ color: statusColor, marginLeft: '5px',fontWeight: 'normal' }}>
                            {formatStatus(request.AnalysisRequestStatus || '')}
                        </strong>
                    </p>
                </div>
                
                {/* 3. ТЕКСТ ДЛЯ АНАЛИЗА */}
                <div style={{ width: '300px', flexShrink: 0, paddingTop: '5px' }}>
                    <p style={{ margin: '0 0 5px 0' }}>Текст для анализа:</p>
                    <blockquote style={{ margin: 0, padding: '0 10px', fontSize: '0.9em', color: '#666', border: '1px solid #ccc', maxHeight: '40px', overflow: 'hidden' }}>
                        {getSnippet(request.TextToAnalyse, 150)}
                    </blockquote>
                </div>

                {/* 4. КОЛИЧЕСТВО ЖАНРОВ И ДАТА ФОРМИРОВАНИЯ */}
                <div style={{ width: '180px', flexShrink: 0, paddingTop: '5px' }}> {/* Изменена ширина */}
                    <p style={{ margin: 0, color: '#555' }}>
                        Формирование: {request.FormedAt ? new Date(request.FormedAt).toLocaleDateString() : '—'}
                    </p>
                </div>

                {/* 5. РЕЗУЛЬТАТЫ АНАЛИЗА / СТАТУС */}
                <div style={{ minWidth: '180px', flexGrow: 1, paddingTop: '5px' }}> {/* Изменена minWidth */}
                    { isCompleted ? (
                        <p style={{ margin: '8px 0', color: '#999', fontSize: '1em', fontWeight: 'normal' }}>
                            Всего жанров с ненулевой вероятностью: {completedGenres}
                        </p>
                    ) : (
                        <p style={{ margin: '8px 0', color: '#999', fontSize: '1em', fontWeight: 'normal' }}>
                            {isReadyToProcess 
                                ? 'В обработке' 
                                : isRejected
                                ? 'Отклонена модератором'
                                : 'Нет результатов анализа' 
                            }
                        </p>
                    )}
                </div>
                
                {/* 6. ПАНЕЛЬ МОДЕРАТОРА (НОВЫЙ СЕКТОР) */}
                {isModerator && (
                    <div 
                        style={{ 
                            minWidth: '200px', 
                            flexShrink: 0, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            paddingTop: '5px', // Выравнивание по верхнему краю
                            gap: '8px',
                        }}
                    >
                        {isReadyToProcess ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStatusChange(request.AnalysisRequestID, 'complete'); }}
                                    className="submit-button"  
                                >
                                    Запустить анализ
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStatusChange(request.AnalysisRequestID, 'reject'); }}
                                    className="delete-button"
                                >
                                    Отклонить
                                </button>
                            </div>
                        ) : (
                            <p style={{ margin: '15px 0 0 0', color: '#999', fontSize: '0.9em', fontStyle: 'italic' }}>
                                { ''}
                            </p>
                        )}
                    </div>
                )}
            </Link>
        </div>
    );
};
// ---------------------------------------------------------------------


const AnalysisRequestList: React.FC = () => {
    console.log("--- КОМПОНЕНТ AnalysisRequestList ОТРИСОВЫВАЕТСЯ ---");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allRequestList = useAppSelector(state => state.analysisRequests.list);
    const loading = useAppSelector(state => state.analysisRequests.loading);
    const error = useAppSelector(state => state.analysisRequests.error);
    
    // Получаем состояние аутентификации
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    // Получаем состояние загрузки аутентификации
    const authLoading = useAppSelector(state => state.auth.loading); 
    
    // Безопасный доступ к вложенным свойствам 'user'
    const role = useAppSelector(state => state.auth.user?.Role); 
    const currentLogin = useAppSelector(state => state.auth.user?.Login); 
    
    const isModerator = role === 'moderator';

    // Устанавливаем сегодняшнюю дату по умолчанию
    const today = useMemo(() => getTodayDate(), []);
    
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterStartDate, setFilterStartDate] = useState<string>(today); 
    const [filterEndDate, setFilterEndDate] = useState<string>(today); 
    const [filterCreatorLogin, setFilterCreatorLogin] = useState<string>(''); 

    // Фронтенд-фильтрация по черновикам и логину модератора
    const requestList = useMemo(() => {
        let filteredList = allRequestList.filter(
            (req) => req.AnalysisRequestStatus?.toLowerCase() !== 'черновик'
        );

        // Применяем фильтр по логину только на фронтенде и только для модератора
        if (isModerator && filterCreatorLogin) {
            const loginToFilter = filterCreatorLogin.toLowerCase();
            filteredList = filteredList.filter(
                (req) => req.CreatorLogin?.toLowerCase().includes(loginToFilter)
            );
        }
        
        return filteredList;
    }, [allRequestList, isModerator, filterCreatorLogin]);


    // Функция для загрузки запросов - логика фильтрации
    const loadRequests = useCallback(() => {
        
        console.log(`loadRequests called. isModerator: ${isModerator}, currentLogin: ${currentLogin}`);
        
        // 1. Определение логина для фильтрации для БЭКЕНДА
        let effectiveCreatorLoginForAPI: string | undefined = undefined;
        
        if (isModerator) {
            // Модератор НЕ отправляет фильтр логина, чтобы получить все заявки с бэкенда.
            console.log("loadRequests: Пользователь - Модератор. Не используем фильтр логина для API. Фильтрация будет на фронтенде.");
            // effectiveCreatorLoginForAPI остается undefined.
        } else {
            // Обычный пользователь: обязательно фильтр по своему логину (безопасность)
            if (!currentLogin) {
                console.warn("loadRequests: Пользователь авторизован, но логин не загружен. Выходим.");
                return; // ❌ EXIT POINT
            }
            effectiveCreatorLoginForAPI = currentLogin;
            console.log(`loadRequests: Пользователь - Обычный. Логин: ${currentLogin}. Продолжаем.`);
        }

        // 2. Логика даты
        let effectiveEndDate: string | undefined = undefined;
        if (filterEndDate) {
            effectiveEndDate = getNextDayString(filterEndDate); // Сдвиг на следующий день
        }

        let effectiveStartDate: string | undefined = undefined;
        if (filterStartDate) {
            effectiveStartDate = filterStartDate;
        }
        
        // Используем effectiveCreatorLoginForAPI, который равен undefined для модератора
        const effectiveFilters: FilterParams = {
            status: filterStatus,
            startDate: effectiveStartDate, 
            endDate: effectiveEndDate,    
            creatorLogin: effectiveCreatorLoginForAPI, 
        };
        
        console.log("loadRequests: Dispatching fetchAnalysisRequestList with filters:", effectiveFilters);
        dispatch(fetchAnalysisRequestList(effectiveFilters) as any); 
    }, [
        dispatch, 
        isModerator, 
        currentLogin, 
        filterStatus, 
        filterStartDate, 
        filterEndDate,
    ]);
    
    
    // Обработчик смены статуса (для модератора)
    const handleStatusChange = useCallback(async (AnalysisRequestID: number, action: 'reject' | 'complete') => {
        try {
            await dispatch(processAnalysisRequest({ AnalysisRequestID, action })).unwrap();
            loadRequests(); // Перезагружаем список после изменения статуса
        } catch (e: any) {
            const errorMessage = e || 'Неизвестная ошибка завершения заявки.';
            console.log(`Ошибка при смене статуса заявки №${AnalysisRequestID}: ${errorMessage}`);
        }
    }, [dispatch, loadRequests]);


    // Эффект для загрузки данных и Short Polling
    useEffect(() => {
        console.log(`AnalysisRequestList: useEffect running. isAuthenticated: ${isAuthenticated}, authLoading: ${authLoading}`);
        
        if (authLoading) {
            console.log("AnalysisRequestList: Auth is loading. Waiting...");
            return; 
        }
        
        if (!isAuthenticated) {
            console.log("AnalysisRequestList: Auth failed or no token. Redirecting.");
            navigate('/login');
            return; 
        }
        
        // Запускаем первую загрузку и последующие
        loadRequests(); 
        
        // Настройка Short Polling 
        const intervalId = setInterval(() => {
            loadRequests();
        }, POLLING_INTERVAL);

        // Очистка интервала
        return () => clearInterval(intervalId);

    }, [isAuthenticated, authLoading, navigate, loadRequests]); 
    
    
    if (authLoading) {
        // Отображаем заглушку во время аутентификации
        return (
            <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                <p>Проверка сессии...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <Header />
            <main className="main-content analysis-list-page" style={{ padding: '20px' }}>
                <h1 className="page-title">
                    Заявки на Анализ
                </h1>
                
                {/* ФИЛЬТРЫ */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '5px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Статус:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc' }}
                        >
                            <option value="">Все статусы</option>
                            <option value="сформирован">Сформирована (в обработке)</option>
                            <option value="завершён">Завершена</option>
                            <option value="отклонён">Отклонена</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Дата формирования от:</label>
                        <input
                            type="date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Дата формирования до:</label>
                        <input
                            type="date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc' }}
                        />
                    </div>
                    {/* Фильтр по создателю (только для модератора) */}
                    {isModerator && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Логин создателя:</label>
                            <input
                                type="text"
                                value={filterCreatorLogin}
                                onChange={(e) => setFilterCreatorLogin(e.target.value)}
                                placeholder="Введите логин..."
                                style={{ padding: '8px', border: '1px solid #ccc', minWidth: '180px' }}
                            />
                        </div>
                    )}
                </div>

                {/* СПИСОК ЗАЯВОК (В ФОРМАТЕ "ПОЛОСОК") */}
                {loading && <p>Загрузка списка заявок...</p>}
                {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
                
                {!loading && requestList.length === 0 && !error && (
                    <p>
                        {isModerator ? 'Не найдено заявок, соответствующих фильтрам.' : 'У вас пока нет созданных заявок с таким статусом.'}
                    </p>
                )}

                {!loading && requestList.length > 0 && (
                    <div className="analysis-request-strips-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd'}}>
                        {requestList.map((req) => (
                            <RequestStrip 
                                key={req.AnalysisRequestID} 
                                request={req} 
                                isModerator={isModerator} 
                                onStatusChange={handleStatusChange} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AnalysisRequestList;