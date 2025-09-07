import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading:false,
}

export const adminReducer = createReducer(initialState, (builder) => {

  builder
    .addCase("LOGIN_USER_STATUS", (state) => {
      state.loading = false;
    })
    .addCase("STOP_LOADING_ADMIN", (state , action) => {
      state.loading = false;
    })
    .addCase("START_LOADING_ADMIN", (state , action) => {
      state.loading = true;
    })
});