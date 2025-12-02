// src/store/analysisRequestSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

const analysisRequestSlice = createSlice({
  name: 'analysisRequests',
  initialState,
  reducers: {
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
      })
      .addCase(fetchAnalysisRequestList.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload as string;
      });
  },
});


export interface FilterParams {
  status?: string;
  startDate?: string; 
  endDate?: string;
}

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

export default analysisRequestSlice.reducer;