import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading:false,
  userData:[],
  isAuthenticated:false
}

export const userReducer = createReducer(initialState, (builder) => {

  builder
    .addCase("LOGIN_USER_STATUS", (state , action) => {
      state.loading = false;
      state.userData = action.payload;
    })
    .addCase("STOP_LOADING", (state , action) => {
      state.loading = false;
    })
    .addCase("START_LOADING", (state , action) => {
      state.loading = true;
      state.isAuthenticated=false
    })
    .addCase("LOGOUT_USER", (state , action) => {
      state.loading = false;
      state.userData =[];
      state.isAuthenticated= false
    })
    .addCase("SET_LOGIN_TYPE", (state , action) => {
      state.currentLoginType = action.payload;
    })
    .addCase("GOOGLE_LOGIN_SUCCESS", (state , action) => {
      state.loading = false;
      state.userData = action.payload;
      state.isAuthenticated=true
    })
    .addCase("EMAIL_PASSWORD_LOGIN_SUCCESS", (state , action) => {
      state.loading = false;
      state.userData = action.payload;
      state.isAuthenticated=true
    })
});