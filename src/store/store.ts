import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
// import profileReducer from "../features/profile/profileSlice";
// import transactionReducer from "../features/transaction/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // profile: profileReducer,
    // transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
