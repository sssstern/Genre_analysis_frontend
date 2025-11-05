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
        const unsubscribe = subscribe(setStatus);
        return () => {
            unsubscribe();
        };
    }, []); 

    return { ...status, refreshStatus };
};


export default useAnalysisRequest;


