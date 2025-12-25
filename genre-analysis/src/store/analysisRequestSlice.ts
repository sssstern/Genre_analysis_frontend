// src/store/analysisRequestSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { type AnalysisRequest } from './cartSlice'; 

interface AnalysisRequestListState {
  list: AnalysisRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisRequestListState = {
  list: [],
  loading: false,
  error: null,
};

// 🔑 Обновленные параметры фильтрации
export interface FilterParams {
  status?: string;
  startDate?: string; 
  endDate?: string;
  creatorLogin?: string; // 🔑 Фильтр по создателю
}


// 🔑 Thunk для получения списка заявок (обновлен для приема creatorLogin)
export const fetchAnalysisRequestList = createAsyncThunk<
    AnalysisRequest[], 
    FilterParams | void, 
    { rejectValue: string }
>(
    'analysisRequests/fetchList',
    async (filters, { rejectWithValue }) => {
        try {
            let url = '/text-analysis-request'; 
            const params = new URLSearchParams();
            
            if (filters?.status && filters.status !== '') {
                params.append('status', filters.status);
            }
            if (filters?.startDate) {
                params.append('start_date', filters.startDate); 
            }
            if (filters?.endDate) {
                params.append('end_date', filters.endDate);
            }
            // 🔑 Передаем фильтр по логину создателя на бэкенд, если он есть
            if (filters?.creatorLogin) {
                params.append('creator_login', filters.creatorLogin);
            }
            
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            const response = await api.get(url); 
            return response.data.data as AnalysisRequest[]; 
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Ошибка загрузки списка заявок'
            );
        }
    }
);


// 🔑 Thunk для модератора: изменение статуса заявки
export const processAnalysisRequest = createAsyncThunk<
    AnalysisRequest, 
    { AnalysisRequestID: number, action: 'reject' | 'complete' }, 
    { rejectValue: string }
>(
    'analysisRequests/processRequest',
    async ({ AnalysisRequestID, action }, { rejectWithValue }) => {
        try {
            // PUT /text-analysis-requests/{id}?action={action}
            const response = await api.put(`/text-analysis-requests/${AnalysisRequestID}/process?action=${action}`, {});
            // Бэкенд возвращает обновленный DTO заявки
            return response.data.data as AnalysisRequest; 
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || `Ошибка смены статуса на '${action}'`
            );
        }
    }
);


const analysisRequestSlice = createSlice({
  name: 'analysisRequests',
  initialState,
  reducers: {
      // 🔑 Новый редьюсер для обновления одной заявки после смены статуса (для Short Polling)
      updateRequestStatus: (state, action: PayloadAction<AnalysisRequest>) => {
          const index = state.list.findIndex(req => req.AnalysisRequestID === action.payload.AnalysisRequestID);
          if (index !== -1) {
              state.list[index] = action.payload; // Заменяем старую заявку на обновленную
          } 
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysisRequestList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisRequestList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchAnalysisRequestList.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload as string;
      })
      // 🔑 Обработка смены статуса: обновляем список локально
      .addCase(processAnalysisRequest.fulfilled, (state, action) => {
          const index = state.list.findIndex(req => req.AnalysisRequestID === action.payload.AnalysisRequestID);
          if (index !== -1) {
              state.list[index] = action.payload;
          }
      })
      .addCase(processAnalysisRequest.rejected, (state, action) => {
          state.loading = false; 
          state.error = action.payload as string;
      });
  },
});

export const { updateRequestStatus } = analysisRequestSlice.actions;

export default analysisRequestSlice.reducer;