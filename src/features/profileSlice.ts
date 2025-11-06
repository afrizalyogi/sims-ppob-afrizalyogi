import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { ApiError } from "../interfaces/ApiError";
import { createAppSlice } from "../store/createAppSlice";
import Api from "../api/Api";

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

interface ProfileState {
  user: UserProfile | null;
  balance: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
}

interface UpdateImageResponse {
  message: string;
  profile_image: string;
}

const initialState: ProfileState = {
  user: null,
  balance: null,
  status: "idle",
  updateStatus: "idle",
  error: null,
};

export const profileSlice = createAppSlice({
  name: "profile",
  initialState,
  reducers: (create) => ({
    clearUpdateStatus: create.reducer((state: ProfileState) => {
      state.updateStatus = "idle";
      state.error = null;
    }),

    getProfile: create.asyncThunk<UserProfile, void, { rejectValue: string }>(
      async (_, { rejectWithValue }) => {
        try {
          const response = await Api.get("/profile");
          return response.data.data as UserProfile;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message || "Gagal mengambil data profile.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: ProfileState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (
          state: ProfileState,
          action: PayloadAction<UserProfile>,
        ) => {
          state.status = "succeeded";
          state.user = action.payload;
        },
        rejected: (
          state: ProfileState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
        },
      },
    ),

    getBalance: create.asyncThunk<number, void, { rejectValue: string }>(
      async (_, { rejectWithValue }) => {
        try {
          const response = await Api.get("/balance");
          return response.data.data.balance as number;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message || "Gagal mengambil saldo.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: ProfileState) => {
          state.status = "loading";
          state.error = null;
        },
        fulfilled: (state: ProfileState, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.balance = action.payload;
        },
        rejected: (
          state: ProfileState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.status = "failed";
          state.error = action.payload || null;
        },
      },
    ),

    updateProfileData: create.asyncThunk<
      UserProfile,
      UpdateProfilePayload,
      { rejectValue: string }
    >(
      async (data, { rejectWithValue }) => {
        try {
          const response = await Api.put("/profile/update", data);
          return response.data.data as UserProfile;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Gagal memperbarui data profile.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: ProfileState) => {
          state.updateStatus = "loading";
          state.error = null;
        },
        fulfilled: (
          state: ProfileState,
          action: PayloadAction<UserProfile>,
        ) => {
          state.updateStatus = "succeeded";
          state.user = action.payload;
        },
        rejected: (
          state: ProfileState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.updateStatus = "failed";
          state.error = action.payload || null;
        },
      },
    ),

    updateProfilePicture: create.asyncThunk<
      UpdateImageResponse,
      FormData,
      { rejectValue: string }
    >(
      async (formData, { rejectWithValue }) => {
        try {
          const response = await Api.put("/profile/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data as UpdateImageResponse;
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const message =
            apiError.response?.data?.message ||
            "Gagal memperbarui foto profile.";
          return rejectWithValue(message);
        }
      },
      {
        pending: (state: ProfileState) => {
          state.updateStatus = "loading";
          state.error = null;
        },
        fulfilled: (
          state: ProfileState,
          action: PayloadAction<UpdateImageResponse>,
        ) => {
          state.updateStatus = "succeeded";
          if (state.user) {
            state.user.profile_image = action.payload.profile_image;
          }
        },
        rejected: (
          state: ProfileState,
          action: PayloadAction<string | undefined>,
        ) => {
          state.updateStatus = "failed";
          state.error = action.payload || null;
        },
      },
    ),
  }),
});

export const {
  clearUpdateStatus,
  getProfile,
  getBalance,
  updateProfileData,
  updateProfilePicture,
} = profileSlice.actions;

export const selectUserProfile = (state: RootState) => state.profile.user;
export const selectUserBalance = (state: RootState) => state.profile.balance;
export const selectProfileStatus = (state: RootState) => state.profile.status;
export const selectUpdateStatus = (state: RootState) =>
  state.profile.updateStatus;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
