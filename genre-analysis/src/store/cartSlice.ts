import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import api from '../api'; 

export interface FlatGenreItemWithAnalysis {
    GenreID: number;
    GenreName: string;
    GenreDescription: string;
    GenreImageURL: string;
    GenreKeywords: string;
    ProbabilityPercent: number | null;
    CommentToRequest: string | null;
}

export interface AnalysisRequest { 
    AnalysisRequestID: number;
    TextToAnalyse: string;
    AnalysisRequestStatus: 'черновик' | 'сформирован' | 'завершён' | 'отклонён'; 
    Genres: FlatGenreItemWithAnalysis[]; 
    CreatorLogin: string;
    CreatedAt: string;
    FormedAt: string;
    // 🔑 Добавляем недостающее поле для отображения прогресса
    genres_completed_count?: number; 
}

type GenreType = {
    GenreID: number;
    GenreName: string;
};

interface CartStatusResponse {
    analysis_request_id: number; 
    genres_in_request_count: number;
}

interface CartState {
    analysisRequestID: number | null;
    itemCount: number;
    loading: boolean;
    error: string | null;
    items: GenreType[]; 
    currentRequest: AnalysisRequest | null; 
}


const initialState: CartState = {
    analysisRequestID: null,
    itemCount: 0,
    loading: false,
    error: null,
    items: JSON.parse(localStorage.getItem('analysisCart') || '[]'),
    currentRequest: null, 
};

export const fetchCartStatus = createAsyncThunk<
    CartStatusResponse, 
    void, 
    { rejectValue: string }
>(
    'cart/fetchCartStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/text-analysis-request/icon');
            const data = response.data.data; 
            
            if (data && data.analysis_request_id !== undefined && data.genres_in_request_count !== undefined) {
                return data as CartStatusResponse; 
            }
            
            return rejectWithValue('Некорректный ответ сервера');
        } catch (err: any) {
            if (err.response && (err.response.status === 401 || err.response.status === 404 || err.response.status === 400)) {
                return { analysis_request_id: 0, genres_in_request_count: 0 } as CartStatusResponse;
            }
            return rejectWithValue(err.response?.data?.message || 'Ошибка получения статуса заявки');
        }
    }
);

export const addItemToCart = createAsyncThunk<
    void, 
    { genreID: number }, 
    { dispatch: any, rejectValue: string }
>(
    'cart/addItemToCart',
    async ({ genreID }, { dispatch, rejectWithValue }) => {
        try {
            await api.post(`/genres/add-to-analysis/${genreID}`); 
            await dispatch(fetchCartStatus()); 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка добавления услуги в заявку');
        }
    }
);

export const fetchAnalysisRequest = createAsyncThunk<
    AnalysisRequest, 
    number, 
    { rejectValue: string }
>(
    'cart/fetchAnalysisRequest',
    async (requestID, { rejectWithValue }) => {
        try {
            const response = await api.get(`/text-analysis-requests/${requestID}`);
            const data = response.data.data as AnalysisRequest;
            

            console.log("--- DEBUG: fetchAnalysisRequest RECEIVED DATA ---");
            const genreItem = data.Genres.find(g => g.GenreID === data.Genres[0]?.GenreID);
            console.log(`Request ID: ${requestID}. Genre ID: ${genreItem?.GenreID}`);
            console.log(`Comment received from API: ${genreItem?.CommentToRequest}`);
            console.log("--- DEBUG: fetchAnalysisRequest END OF RECEIVED DATA ---");

            return data; 
        } catch (err: any) {
            console.error("--- DEBUG: fetchAnalysisRequest ERROR ---");
            if (err.response) {
                console.error("Server Response Status:", err.response.status);
                console.error("Server Response Data:", err.response.data);
            }
            return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки заявки');
        }
    }
);


export const updateAnalysisText = createAsyncThunk<
    void, 
    { requestID: number, text: string }, 
    { dispatch: any, rejectValue: string }
>(
    'cart/updateAnalysisText',
    async ({ requestID, text }, { dispatch, rejectWithValue }) => {
        try {
            await api.put(`/text-analysis-requests/${requestID}`, { 
                TextToAnalyse: text 
            }); 
            await dispatch(fetchAnalysisRequest(requestID) as any);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка сохранения текста');
        }
    }
);

export const submitAnalysisRequest = createAsyncThunk<
    void, 
    number, 
    { dispatch: any, rejectValue: string }
>(
    'cart/submitAnalysisRequest',
    async (requestID, { dispatch, rejectWithValue }) => {
        try {
            await api.put(`/text-analysis-requests/${requestID}/form`); 
            await dispatch(fetchCartStatus() as any); 
            await dispatch(fetchAnalysisRequest(requestID) as any); 
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка формирования заявки');
        }
    }
);

export const deleteAnalysisRequest = createAsyncThunk<
    void, 
    number, 
    { dispatch: any, rejectValue: string }
>(
    'cart/deleteAnalysisRequest',
    async (requestID, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/text-analysis-requests/${requestID}`); 
            dispatch(resetCartStatus());
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка удаления заявки');
        }
    }
);


export const deleteItemFromRequest = createAsyncThunk<
    void, 
    { requestID: number, itemID: number }, 
    { dispatch: any, rejectValue: string }
>(
    'cart/deleteItemFromRequest',
    async ({ requestID, itemID }, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/analysis-genres/${itemID}`); 
            
            await dispatch(fetchCartStatus() as any); 
            await dispatch(fetchAnalysisRequest(requestID) as any);

        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка удаления услуги из заявки');
        }
    }
);

export const updateAnalysisGenreComment = createAsyncThunk<
    void, 
    { itemID: number, requestID: number, comment: string }, 
    { dispatch: any, rejectValue: string }
>(
    'cart/updateAnalysisGenreComment',
    async ({ itemID, requestID, comment }, { dispatch, rejectWithValue }) => {
        const payload = { 
            comment_to_request: comment,
            ProbabilityPercent: 0 
        };
        const endpoint = `/analysis-genres/${itemID}`;

        console.log("--- DEBUG: updateAnalysisGenreComment (Sending full DTO) ---");
        console.log(`Sending PUT request to: ${endpoint}`);
        console.log("Payload:", payload);

        try {
            const response = await api.put(endpoint, payload); 
            
            console.log(`Comment PUT successful. Status: ${response.status}. Refetching...`);

            await dispatch(fetchAnalysisRequest(requestID) as any); 
            
            console.log("--- DEBUG: updateAnalysisGenreComment REFETCH COMPLETE ---");
            
            return;

        } catch (err: any) {
            console.error("--- DEBUG: updateAnalysisGenreComment ERROR ---");
            if (err.response) {
                console.error("Server Response Status:", err.response.status);
                console.error("Server Response Data:", err.response.data);
            }
            
            return rejectWithValue(err.response?.data?.message || 'Ошибка сохранения комментария');
        }
    }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartStatus: (state) => {
            state.analysisRequestID = null;
            state.itemCount = 0;
            state.loading = false;
            state.error = null;
        },
        addToCart: (state, action: PayloadAction<GenreType>) => {
            if (!state.items.find(item => item.GenreID === action.payload.GenreID)) {
                state.items.push(action.payload);
                localStorage.setItem('analysisCart', JSON.stringify(state.items));
            }
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('analysisCart');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCartStatus.fulfilled, (state, action: PayloadAction<CartStatusResponse>) => {
                state.loading = false;
                state.analysisRequestID = action.payload.analysis_request_id || null;
                state.itemCount = action.payload.genres_in_request_count || 0;
                state.error = null;
            })
            .addCase(fetchCartStatus.rejected, (state, action) => {
                state.loading = false;
                state.analysisRequestID = null;
                state.itemCount = 0;
                state.error = action.payload as string; 
            })
            .addCase(fetchAnalysisRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentRequest = null;
            })
            .addCase(fetchAnalysisRequest.fulfilled, (state, action: PayloadAction<AnalysisRequest>) => {
                state.loading = false;
                state.currentRequest = action.payload;
                state.error = null;
            })
            .addCase(fetchAnalysisRequest.rejected, (state, action) => {
                state.loading = false;
                state.currentRequest = null;
                state.error = action.payload as string;
            })

            .addMatcher(
                isAnyOf(
                    addItemToCart.pending,
                    deleteItemFromRequest.pending, 
                    deleteAnalysisRequest.pending, 
                    submitAnalysisRequest.pending,
                    updateAnalysisText.pending, 
                    updateAnalysisGenreComment.pending
                ),
                (state) => { state.loading = true; state.error = null; }
            )
            .addMatcher(
                isAnyOf(
                    addItemToCart.rejected,
                    deleteItemFromRequest.rejected, 
                    deleteAnalysisRequest.rejected, 
                    submitAnalysisRequest.rejected,
                    updateAnalysisText.rejected, 
                    updateAnalysisGenreComment.rejected
                ),
                (state, action) => { state.loading = false; state.error = action.payload as string; }
            )
            .addMatcher(
                isAnyOf(
                    addItemToCart.fulfilled,
                    deleteItemFromRequest.fulfilled, 
                    deleteAnalysisRequest.fulfilled, 
                    submitAnalysisRequest.fulfilled,
                    updateAnalysisText.fulfilled, 
                    updateAnalysisGenreComment.fulfilled
                ),
                (state) => { state.loading = false; }
            );
    },
});

export const { resetCartStatus, addToCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;