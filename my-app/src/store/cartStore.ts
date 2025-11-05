type Listener = (status: AnalysisStatus) => void;

interface AnalysisStatus {
    analysisID: number;
    count: number;
    loading: boolean;
    error: string | null;
}

// Глобальное состояние
let currentStatus: AnalysisStatus = {
    analysisID: 0,
    count: 0,
    loading: true,
    error: null,
};

const listeners = new Set<Listener>();

const subscribe = (listener: Listener) => {
    listeners.add(listener);
    listener(currentStatus);
    return () => {
        listeners.delete(listener);
    };
};

const setStatus = (newStatus: Partial<AnalysisStatus>) => {
    currentStatus = { ...currentStatus, ...newStatus };
    listeners.forEach(listener => listener(currentStatus));
};

const API_ICON_URL = '/api/v1/text-analysis-request/icon';
let isInitialFetchDone = false; 

const fetchStatus = async () => {
    if (currentStatus.loading && isInitialFetchDone) return; 
    
    setStatus({ loading: true, error: null });

    try {
        const response = await fetch(API_ICON_URL, {
            credentials: 'include',
        });
        
        if (!response.ok) {
            console.error(`[CartStore ERROR] API Status: ${response.status}`);
            throw new Error(`Ошибка сети/сервера: статус ${response.status}. Возможно, требуется авторизация.`);
        }
        
        const rawData = await response.json();
        
        const data = rawData.data || rawData;
        
        const currentID = data.analysis_request_id || data.AnalysisRequestID || data.analysisRequestID || 0;
        const currentCount = data.genres_in_request_count || data.analysis_count || data.AnalysisCount || data.analysisCount || 0;
        
        console.log(`[CartStore SUCCESS] Получен ID: ${currentID}, Count: ${currentCount}. Полный ответ:`, rawData);

        setStatus({ 
            analysisID: currentID, 
            count: currentCount, 
            loading: false, 
            error: null 
        });

    } catch (e) {
        if (e instanceof Error) {
            console.error("Ошибка загрузки статуса заявки:", e.message);
            setStatus({ analysisID: 0, count: 0, loading: false, error: "Не удалось загрузить статус заявки: " + e.message });
        } else {
            setStatus({ analysisID: 0, count: 0, loading: false, error: "Неизвестная ошибка загрузки статуса" });
        }
    } finally {
        isInitialFetchDone = true;
    }
};

const refreshStatus = () => {
    fetchStatus();
};

fetchStatus();

export { subscribe, refreshStatus, fetchStatus };
export type { AnalysisStatus };