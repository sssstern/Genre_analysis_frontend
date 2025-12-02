import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api'; 
import { mockGenres, findMockGenreById } from '../mockData';

export interface FullGenreDetails {
    GenreID: number;
    GenreName: string;
    GenreKeywords: string;
    GenreImageURL: string;
}

interface GenreState {
    list: FullGenreDetails[];
    currentGenre: FullGenreDetails | null;
    loadingList: boolean;
    loadingDetails: boolean;
    error: string | null;
    searchTerm: string; 
}

const initialState: GenreState = {
    list: [],
    currentGenre: null,
    loadingList: false,
    loadingDetails: false,
    error: null,
    searchTerm: '',
};

export const fetchAllGenres = createAsyncThunk<
    FullGenreDetails[],
    string | undefined, 
    { rejectValue: string }
>(
    'genres/fetchAllGenres',
    async (query, { rejectWithValue }) => {
        try {
            const url = query && query.trim()
                ? `/genres?searchbygenrename=${encodeURIComponent(query.trim())}`
                : '/genres';
            
            const response = await api.get(url);
            return response.data.data as FullGenreDetails[];
        } catch (err: any) {
            const fallbackList = mockGenres.filter(g => 
                !query || g.GenreName.toLowerCase().includes(query.toLowerCase())
            );

            if (fallbackList.length > 0) {
                 console.warn("Ошибка API. Используются mock-данные для списка.");
                 return fallbackList;
            }
            
            return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки списка жанров. Бэкенд недоступен.');
        }
    }
);

export const fetchGenreDetails = createAsyncThunk<
    FullGenreDetails,
    number, 
    { rejectValue: string }
>(
    'genres/fetchGenreDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/genres/${id}`);
            return response.data.data as FullGenreDetails;
        } catch (err: any) {
            const fallbackGenre = findMockGenreById(id);

            if (fallbackGenre) {
                console.warn(`Ошибка API. Используются mock-данные для жанра ID: ${id}`);
                return fallbackGenre;
            }
            
            return rejectWithValue(err.response?.data?.message || `Ошибка загрузки деталей жанра ${id}. Бэкенд недоступен.`);
        }
    }
);

const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        clearGenreDetails: (state) => {
            state.currentGenre = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGenres.pending, (state) => {
                state.loadingList = true;
                state.error = null;
            })
            .addCase(fetchAllGenres.fulfilled, (state, action) => {
                state.loadingList = false;
                state.list = action.payload;
            })
            .addCase(fetchAllGenres.rejected, (state, action) => {
                state.loadingList = false;
                state.list = [];
                state.error = action.payload as string;
            })
            .addCase(fetchGenreDetails.pending, (state) => {
                state.loadingDetails = true;
                state.currentGenre = null;
                state.error = null;
            })
            .addCase(fetchGenreDetails.fulfilled, (state, action) => {
                state.loadingDetails = false;
                state.currentGenre = action.payload;
            })
            .addCase(fetchGenreDetails.rejected, (state, action) => {
                state.loadingDetails = false;
                state.currentGenre = null;
                state.error = action.payload as string;
            });
    },
});

export const { setSearchTerm, clearGenreDetails } = genreSlice.actions;
export default genreSlice.reducer;