import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ApiError } from "../interfaces/ApiError";
import { createAppSlice } from "../store/createAppSlice";
import Api from "../api/Api";

interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface Banner {
  banner_name: string;
  banner_image: string;
}

interface TransactionState {
  services: Service[];
  banners: Banner[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TransactionState = {
  services: [],
  banners: [],
  status: "idle",
  error: null,
};

export const transactionSlice = createAppSlice({
  name: "transaction",
  initialState,
  reducers: (create) => ({
    clearTransactionStatus: create.reducer((state) => {
      state.status = "idle";
      state.error = null;
    }),
    getServices: create.asyncThunk<Service[], void, { rejectValue: string }>(
      async (_, { rejectWithValue }) => {
        try {
          const response = await Api.get("/services");
          return response.data.data as Service[];
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Gagal mengambil daftar layanan.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: TransactionState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (
          state: TransactionState,
          action: PayloadAction<Service[]>,
        ) => {
          state.status = "succeeded";
          state.services = action.payload;
        },
        rejected: (
          state: TransactionState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
        },
      },
    ),
    getBanners: create.asyncThunk<Banner[], void, { rejectValue: string }>(
      async (_, { rejectWithValue }) => {
        try {
          const response = await Api.get("/banner");
          return response.data.data as Banner[];
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Gagal mengambil daftar banner.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: TransactionState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (
          state: TransactionState,
          action: PayloadAction<Banner[]>,
        ) => {
          state.status = "succeeded";
          state.banners = action.payload;
        },
        rejected: (
          state: TransactionState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
        },
      },
    ),
  }),
});

export const { clearTransactionStatus, getServices, getBanners } =
  transactionSlice.actions;

export const selectServices = (state: RootState) => state.transaction.services;
export const selectBanners = (state: RootState) => state.transaction.banners;
export const selectTransactionStatus = (state: RootState) =>
  state.transaction.status;

export default transactionSlice.reducer;
