// src/store/index.ts — ЭТО ГЛАВНЫЙ ФАЙЛ! ДЕЛАЙ ТОЧНО ТАК!
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import genreReducer from './genreSlice';
import analysisRequestsReducer from './analysisRequestSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,   
    cart: cartReducer,    
    genre: genreReducer, 
    analysisRequests: analysisRequestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;