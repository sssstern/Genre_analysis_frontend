import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Начальное состояние (initialState) — пустые строки для фильтров
const initialState: { searchTerm: string; filterQuery: string } = {
  searchTerm: '',
  filterQuery: '',
};

const filterSlice = createSlice({
  name: 'filter', // Имя слайса
  initialState,
  reducers: {
    // Редьюсер для обновления searchTerm
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    // Редьюсер для обновления filterQuery (при submit поиска)
    setFilterQuery: (state, action: PayloadAction<string>) => {
      state.filterQuery = action.payload;
    },
    // Редьюсер для сброса фильтров (опционально, для удобства)
    resetFilters: (state) => {
      state.searchTerm = '';
      state.filterQuery = '';
    },
  },
});

// Экспорт actions для dispatch
export const { setSearchTerm, setFilterQuery, resetFilters } = filterSlice.actions;

// Экспорт селекторов для useSelector
export const selectSearchTerm = (state: { filter: { searchTerm: string } }) => state.filter.searchTerm;
export const selectFilterQuery = (state: { filter: { filterQuery: string } }) => state.filter.filterQuery;

export default filterSlice.reducer;