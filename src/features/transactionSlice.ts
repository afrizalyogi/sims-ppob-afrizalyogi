import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ApiError } from "../interfaces/ApiError";
import { createAppSlice } from "../store/createAppSlice";
import Api from "../api/Api";

export interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface Banner {
  banner_name: string;
  banner_image: string;
}

interface TopUpPayload {
  top_up_amount: number;
}

interface PaymentPayload {
  service_code: string;
  service_amount: number;
}

interface HistoryTransaction {
  invoice_number: string;
  transaction_type: "TOPUP" | "PAYMENT";
  description: string;
  total_amount: number;
  created_on: string;
}

interface TransactionState {
  services: Service[];
  banners: Banner[];
  history: HistoryTransaction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  historyStatus: "idle" | "loading" | "succeeded" | "failed";
  historyError: string | null;
}

const initialState: TransactionState = {
  services: [],
  banners: [],
  history: [],
  status: "idle",
  error: null,
  historyStatus: "idle",
  historyError: null,
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

    topUp: create.asyncThunk<string, TopUpPayload, { rejectValue: string }>(
      async (data, { rejectWithValue }) => {
        try {
          const response = await Api.post("/topup", data);
          return response.data.message as string;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Top Up Gagal. Saldo tidak bertambah.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (state) => {
          state.status = "succeeded";
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    transaction: create.asyncThunk<
      string,
      PaymentPayload,
      { rejectValue: string }
    >(
      async (data, { rejectWithValue }) => {
        try {
          const response = await Api.post("/transaction", data);
          return response.data.message as string;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Transaksi Gagal. Saldo mungkin tidak mencukupi.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (state) => {
          state.status = "succeeded";
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        },
      },
    ),

    getHistory: create.asyncThunk<
      HistoryTransaction[],
      { limit: number; offset: number },
      { rejectValue: string }
    >(
      async ({ limit, offset }, { rejectWithValue }) => {
        try {
          const response = await Api.get(
            `/transaction/history?limit=${limit}&offset=${offset}`,
          );
          return response.data.data.records as HistoryTransaction[];
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Gagal mengambil riwayat transaksi.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state, action) => {
          state.historyStatus = "loading";
          state.historyError = null;
          if (action.meta.arg.offset === 0) {
            state.history = [];
          }
        },
        fulfilled: (state, action) => {
          state.historyStatus = "succeeded";
          if (action.payload && action.payload.length > 0) {
            const newItems = action.payload.filter(
              (newItem) =>
                !state.history.some(
                  (existingItem) =>
                    existingItem.invoice_number === newItem.invoice_number,
                ),
            );
            state.history = state.history.concat(newItems);
          }
        },
        rejected: (state, action) => {
          state.historyStatus = "failed";
          state.historyError = action.payload || null;
        },
      },
    ),
  }),
});

export const { clearTransactionStatus } = transactionSlice.actions;

export const { getServices, getBanners, topUp, transaction, getHistory } =
  transactionSlice.actions;

export const selectServices = (state: RootState) => state.transaction.services;
export const selectBanners = (state: RootState) => state.transaction.banners;
export const selectTransactionStatus = (state: RootState) =>
  state.transaction.status;
export const selectTransactionHistory = (state: RootState) =>
  state.transaction.history;
export const selectHistoryStatus = (state: RootState) =>
  state.transaction.historyStatus;

export default transactionSlice.reducer;
