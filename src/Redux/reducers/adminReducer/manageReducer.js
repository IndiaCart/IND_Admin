import { createReducer, current } from "@reduxjs/toolkit";

const initialState = {
  loading:false,
  fetchedCategories:[],
  fetchedSubCategory:[],
  fetchedVariation:[],
  fetchedProduct:[],
  error_message:"",
  currentSelectedProduct:[],
  currentSelectedCategory:[],
  currentSelectedSubCategory:[]
}

export const manageReducer = createReducer(initialState, (builder) => {

  builder
    .addCase("START_MANAGE_LOADING", (state) => {
      state.loading = true;
    })
    .addCase("STOP_LOADING_MANAGE", (state , action) => {
      state.loading = false;
    })
    .addCase("FETCH_FAILURE", (state , action) => {
      state.loading = false;
      state.error_message = action.payload;
    })
    .addCase("FETCH_CATEGORY_SUCCESS", (state , action) => {
      state.loading = false;
      state.fetchedCategories = action.payload;
    })
    .addCase("FETCH_SUB_CATEGORY_SUCCESS", (state , action) => {
      state.loading = false;
      state.fetchedSubCategory = action.payload;
    })
    .addCase("FETCH_ALL_VARIATION_SUCCESS", (state , action) => {
      state.loading = false;
      state.fetchedVariation = action.payload;
    })
    .addCase("FETCH_ALL_PRODUCT_SUCCESS", (state , action) => {
      state.loading = false;
      state.fetchedProduct = action.payload;
    })
    .addCase("SET_CURRENT_SELECTED_PRODUCT", (state , action) => {
      state.loading = false;
      state.currentSelectedProduct = action.payload;
    })
    .addCase("CLEAR_CURRENT_SELECTED_PRODUCT", (state , action) => {
      state.loading = false;
      state.currentSelectedProduct = [];
    })
    .addCase("SET_CURRENT_SELECTED_CATEGORY", (state , action) => {
      state.loading = false;
      state.currentSelectedCategory = action.payload;
    })
    .addCase("SET_CURRENT_SELECTED_SUBCATEGORY", (state , action) => {
      state.loading = false;
      state.currentSelectedSubCategory = action.payload;
    })
});