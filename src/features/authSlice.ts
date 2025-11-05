import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ApiError } from "../interfaces/ApiError";
import { createAppSlice } from "../store/createAppSlice";
import Api from "../api/Api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}
interface LoginResponseData {
  token: string;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  status: "idle",
  error: null,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    logout: create.reducer((state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      state.status = "idle";
      state.error = null;
    }),
    clearAuthStatus: create.reducer((state) => {
      state.status = "idle";
      state.error = null;
    }),

    login: create.asyncThunk<
      LoginResponseData,
      LoginPayload,
      { rejectValue: string }
    >(
      async (credentials, { rejectWithValue }) => {
        try {
          const response = await Api.post("/login", credentials);
          const token = response.data.data.token as string;
          localStorage.setItem("token", token);
          return { token };
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            apiError.message ||
            "Login Gagal. Silakan coba lagi.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: AuthState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (
          state: AuthState,
          action: PayloadAction<LoginResponseData>,
        ) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.isAuthenticated = true;
        },
        rejected: (
          state: AuthState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
          state.isAuthenticated = false;
          state.token = null;
        },
      },
    ),

    registration: create.asyncThunk<
      string,
      RegisterPayload,
      { rejectValue: string }
    >(
      async (userData, { rejectWithValue }) => {
        try {
          const response = await Api.post("/registration", userData);
          return response.data.message as string;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            apiError.message ||
            "Registrasi Gagal. Mohon periksa data Anda.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: AuthState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (state: AuthState) => {
          state.status = "succeeded";
        },
        rejected: (
          state: AuthState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
        },
      },
    ),
  }),
});

export const { logout, clearAuthStatus, login, registration } =
  authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
