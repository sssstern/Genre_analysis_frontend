import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnalysisRequestList, type FilterParams } from '../store/analysisRequestSlice';
import { type AnalysisRequest } from '../store/cartSlice'; 


interface RootState {
    analysisRequests: {
        list: AnalysisRequest[];
        loading: boolean;
        error: string | null;
    };
    auth: {
        isAuthenticated: boolean;
    };
}

const AnalysisRequestList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allRequestList = useAppSelector((state: RootState) => state.analysisRequests.list);
    const loading = useAppSelector((state: RootState) => state.analysisRequests.loading);
    const error = useAppSelector((state: RootState) => state.analysisRequests.error);
    const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterStartDate, setFilterStartDate] = useState<string>(''); 
    const [filterEndDate, setFilterEndDate] = useState<string>('');

    const requestList = useMemo(() => {
        return allRequestList.filter(
            (req) => req.AnalysisRequestStatus?.toLowerCase() !== 'черновик'
        );
    }, [allRequestList]);


    const loadRequests = useCallback((filters: FilterParams) => {
        dispatch(fetchAnalysisRequestList(filters) as any);
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadRequests({
            status: filterStatus,
            startDate: filterStartDate,
            endDate: filterEndDate,
        });
    }, [isAuthenticated, navigate, loadRequests, filterStatus, filterStartDate, filterEndDate]); 
    const formatStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'сформирован': return 'Сформирована';
            case 'завершён': return 'Завершена';
            case 'отклонён': return 'Отклонена';
            default: return status;
        }
    };


    return (
        <div className="container">
            <Header />
            <main className="main-content analysis-list-page" style={{ padding: '20px' }}>
                <h1 className="page-title">Мои Заявки на Анализ</h1>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Статус:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '8px', border: '1px solid #ccc' }}
                        >
                            <option value="">Все статусы</option>
                            <option value="сформирован">Сформирована</option>
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

                </div>
                {loading && <p>Загрузка списка заявок...</p>}
                {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
                
                {!loading && requestList.length === 0 && !error && (
                    <p>
                        У вас пока нет созданных заявок с таким статусом. 
                    </p>
                )}

                {!loading && requestList.length > 0 && (
                    <table className="analysis-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fff' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Статус</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Количество жанров</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Дата формирования</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestList.map((req) => (
                                <tr key={req.AnalysisRequestID} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{req.AnalysisRequestID}</td>
                                    <td style={{ padding: '10px' }}>
                                        {formatStatus(req.AnalysisRequestStatus || '')}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {req.Genres?.length || 0}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {req.FormedAt
                                            ? new Date(req.FormedAt).toLocaleDateString()
                                            : '-'
                                        }
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <Link 
                                            to={`/genreanalysisrequest/${req.AnalysisRequestID}`} 
                                            className="view-request-link"
                                            style={{ color: '#000000', textDecoration: 'none' }}
                                        >
                                            Просмотр
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default AnalysisRequestList;