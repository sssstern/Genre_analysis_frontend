import { useState, useEffect } from 'react';
import { type AnalysisStatus, subscribe, refreshStatus } from '../store/cartStore';

const useAnalysisRequest = () => {
    const [status, setStatus] = useState<AnalysisStatus>({
        analysisID: 0,
        count: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Подписываемся на изменения в хранилище
        const unsubscribe = subscribe(setStatus);
        return () => {
            // Отписываемся при размонтировании
            unsubscribe();
        };
    }, []); 

    // Возвращаем функцию принудительного обновления для использования в GenreCard
    return { ...status, refreshStatus };
};


export default useAnalysisRequest;


