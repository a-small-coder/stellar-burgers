import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    }
    throw new Error('Ошибка регистрации');
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    }
    throw new Error('Ошибка авторизации');
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  if (response.success) {
    return response.user;
  }
  throw new Error('Ошибка получения данных пользователя');
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    if (response.success) {
      return response.user;
    }
    throw new Error('Ошибка обновления данных');
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      try {
        await dispatch(getUser()).unwrap();
      } catch {
        // Токен невалиден, очищаем
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      }
    }
    // Явно возвращаем undefined, чтобы thunk завершился успешно
    // и isAuthChecked был установлен в true через extraReducers
    return undefined;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })
      // Get User
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.updateLoading = false;
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message || 'Ошибка обновления данных';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error,
    selectUpdateLoading: (state) => state.updateLoading,
    selectUpdateError: (state) => state.updateError
  }
});

export const { clearError } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  selectUpdateLoading,
  selectUpdateError
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
