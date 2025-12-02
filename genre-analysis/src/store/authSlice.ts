import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetCartStatus } from './cartSlice'; 
import api, { setAuthToken } from '../api';

export interface UserProfile { 
  Login: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: null,
};

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile'); 
      return response.data.data;
    } catch (err: any) {
      localStorage.removeItem('token'); 
      return rejectWithValue('Профиль не загружен');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ login, password }: { login: string; password: string }, { rejectWithValue }) => {
    try {
      await api.post('/user/register', { login, password });
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ login, password }: { login: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/user/login', { login, password });
      const token = response.data.data.access_token;
      if (!token) throw new Error('Токен не пришёл');
      setAuthToken(token); 
      localStorage.setItem('token', token);
      const profileResult = await dispatch(fetchProfile() as any).unwrap();
      return { token, user: profileResult }; 
      
    } catch (err: any) { 
      setAuthToken(null);
      return rejectWithValue(err.response?.data?.message || 'Ошибка входа');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  localStorage.removeItem('token');
  setAuthToken(null);
  dispatch(resetCartStatus());
});

export const updateProfile = createAsyncThunk<
  UserProfile,
  { newPassword: string }, 
  { rejectValue: string }
>('auth/updateProfile', async (updateData, { rejectWithValue }) => {
  try {
    const response = await api.put('/user/profile', { password: updateData.newPassword });
    return response.data.data as UserProfile;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Ошибка обновления пароля'
    );
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true; 
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false; 
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false; 
      })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload; 
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions; 
export default authSlice.reducer;