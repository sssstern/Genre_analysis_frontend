import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'; 
import { resetCartStatus } from './cartSlice'; 
import api, { setAuthToken } from '../api'; 
// Предполагается, что эти типы существуют
import { UserService, DsUserDTO, DsChangeUserDTO } from '../api/ApiService'; 
import { AppDispatch } from '.';

// 🔑 Обновленное состояние
interface AuthState {
  isAuthenticated: boolean;
  user: DsUserDTO | null; 
  loading: boolean;
  error: string | null;
  token: string | null;
  role: 'user' | 'moderator' | null; // 🔑 Добавлено поле роли
  login: string | null; // 🔑 Добавлено поле логина
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: null,
  role: null, 
  login: null, // Инициализация
};

// 🔑 Функция для определения роли
// ПРИМЕЧАНИЕ: Предполагаем, что DsUserDTO содержит поле 'login: string'.
const determineRole = (user: DsUserDTO): 'user' | 'moderator' => {
    // Используем здесь фактический логин модератора
    return (user as any).login?.toLowerCase() === 'moderator' ? 'moderator' : 'user';
}

export const registerUser = createAsyncThunk<boolean, DsChangeUserDTO, { rejectValue: string }>(
 'auth/register',
 async (requestData, { rejectWithValue }) => {
  try {
   await UserService.registerCreate(requestData); 
   return true;
  } catch (err: any) {
   return rejectWithValue(err.response?.data?.message || 'Ошибка регистрации');
  }
 }
);

// 🔑 Обновляем тип возвращаемого значения: добавляем role и login
export const loginUser = createAsyncThunk<
 { user: DsUserDTO; token: string; role: 'user' | 'moderator'; login: string }, 
 DsChangeUserDTO, 
 { dispatch: AppDispatch; rejectValue: string }
>(
 'auth/login',
 async (credentials, { dispatch, rejectWithValue }) => {
  try {
   const authResponse = await UserService.loginCreate(credentials); 
   
   const responseData = (authResponse as any).data || authResponse;
   const token = responseData.access_token;
   
   if (!token) throw new Error('Токен не получен от сервера при входе');
   
   setAuthToken(token);
   localStorage.setItem('token', token);
   
   const profileResult = await dispatch(fetchProfile() as any).unwrap();
   
   // 🔑 Определяем роль и логин
   const role: 'user' | 'moderator' = determineRole(profileResult);
   const login = (profileResult as any).login as string; // Получаем логин
   
   return { token, user: profileResult, role, login }; 

  } catch (err: any) {
   setAuthToken(null); 
   localStorage.removeItem('token');
   return rejectWithValue(err.response?.data?.message || 'Ошибка входа');
  }
 }
);

// 🔑 Обновляем тип возвращаемого значения: возвращаем чистый DsUserDTO
export const fetchProfile = createAsyncThunk<DsUserDTO, void, { rejectValue: string }>( 
 'auth/fetchProfile',
 async (_, { rejectWithValue }) => {
  try {
   const response = await api.get('/user/profile'); 
   const user = response.data.data as DsUserDTO;
   return user; 
  } catch (err: any) {
   localStorage.removeItem('token'); 
   setAuthToken(null);
   return rejectWithValue('Профиль не загружен: требуется авторизация');
  }
 }
);


export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }> (
 'auth/logout',
 async (_, { dispatch }) => {
  try {
   await UserService.logoutCreate();
  } catch (err) {
    // Игнорируем ошибку выхода, так как токен все равно удаляется
  } finally {
        localStorage.removeItem('token');
        setAuthToken(null);
        dispatch(resetCartStatus());
  }
 }
);

export const updateProfile = createAsyncThunk<
  DsUserDTO,
  { newPassword: string }, 
  { rejectValue: string }
>('auth/updateProfile', async (updateData, { rejectWithValue }) => {
  try {
    const response = await api.put('/user/profile', { password: updateData.newPassword });
    return response.data.data as DsUserDTO;
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
  setAuthError: (state, action: PayloadAction<string | null>) => {
   state.error = action.payload;
  },
  clearAuth: (state) => {
    state.isAuthenticated = false;
    state.user = null;
    state.token = null;
    state.role = null; 
    state.login = null; // 🔑 Очищаем login
  }
 },
 extraReducers: (builder) => {
  builder
   .addCase(registerUser.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(registerUser.fulfilled, (state) => {
    state.loading = false;
    state.error = null;
   })
   .addCase(registerUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
   })
   .addCase(loginUser.pending, (state) => {
    state.loading = true;
    state.error = null;
   })
   .addCase(loginUser.fulfilled, (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user; 
    state.token = action.payload.token;
    state.role = action.payload.role; // 🔑 Сохраняем роль
    state.login = action.payload.login; // 🔑 Сохраняем логин
    state.error = null;
   })
   .addCase(loginUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
    state.role = null; 
    state.login = null; // 🔑 Очищаем login
   })
   .addCase(logoutUser.fulfilled, (state) => {
    state.isAuthenticated = false;
    state.user = null;
    state.token = null;
    state.role = null; // 🔑 Очищаем роль
    state.login = null; // 🔑 Очищаем login
   })
   .addCase(fetchProfile.pending, (state) => {
    state.loading = true; 
   })
   .addCase(fetchProfile.fulfilled, (state, action) => {
    state.user = action.payload;
    state.isAuthenticated = true;
    state.loading = false; 
    
    // 🔑 Вычисляем и сохраняем роль и логин из полученного DTO
    const role = determineRole(action.payload);
    const login = (action.payload as any).login as string | null;

    state.role = role; 
    state.login = login;
   })
   .addCase(fetchProfile.rejected, (state) => {
    state.user = null;
    state.isAuthenticated = false;
    state.loading = false; 
    state.role = null; // 🔑 Очищаем роль
    state.login = null; // 🔑 Очищаем login
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

export const { setAuthError, clearAuth } = authSlice.actions;

export default authSlice.reducer;