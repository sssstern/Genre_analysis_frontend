import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice'; // Импорт редуктора из слайса

// Настраиваем store с combineReducers (хотя здесь один редуктор)
const store = configureStore({
  reducer: {
    filter: filterReducer, // Ключ 'filter' для нашего слайса
  },
  // Для devTools — по умолчанию включено в Toolkit, но для продакшена можно отключить
  //devTools: process.env.NODE_ENV !== 'production', // Включено в dev
});

export type RootState = ReturnType<typeof store.getState>; // Тип для состояния (для TS)
export type AppDispatch = typeof store.dispatch; // Тип для dispatch (для TS)

export default store;