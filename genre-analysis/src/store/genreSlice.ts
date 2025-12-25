import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
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

const genreSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        clearGenreDetails: (state) => {
            state.currentGenre = null;
            state.loadingDetails = false;
            state.error = null;
        },
        fetchListPending: (state) => {
            state.loadingList = true;
            state.error = null;
        },
        fetchListFulfilled: (state, action: PayloadAction<FullGenreDetails[]>) => {
            state.loadingList = false;
            state.list = action.payload;
            state.error = null;
        },
        fetchListRejected: (state, action: PayloadAction<string>) => {
            state.loadingList = false;
            state.list = []; 
            state.error = action.payload;
        },
        fetchDetailsPending: (state) => {
            state.loadingDetails = true;
            state.currentGenre = null;
            state.error = null;
        },
        fetchDetailsFulfilled: (state, action: PayloadAction<FullGenreDetails>) => {
            state.loadingDetails = false;
            state.currentGenre = action.payload;
            state.error = null;
        },
        fetchDetailsRejected: (state, action: PayloadAction<string>) => {
            state.loadingDetails = false;
            state.currentGenre = null;
            state.error = action.payload;
        },
    },
});

export const { 
    setSearchTerm, 
    clearGenreDetails, 
    fetchListPending, 
    fetchListFulfilled, 
    fetchListRejected,
    fetchDetailsPending,
    fetchDetailsFulfilled,
    fetchDetailsRejected,
} = genreSlice.actions;

export default genreSlice.reducer;