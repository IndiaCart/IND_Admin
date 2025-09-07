import axios from "axios";
import { GetAllCategoryUrl, getAllProductUrl, GetAllSubCategoryUrl } from "../../../utils/apis/adminAPI";
import { HOSTED_URL } from '@env'
export const getAllProduct = () => async (dispatch) => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });
      const response = await axios.get(`${HOSTED_URL}${getAllProductUrl}`);
      console.log("PPP", response)
      if (response.data.success) {
        dispatch({
          type: "FETCH_ALL_PRODUCT_SUCCESS",
          payload: response.data.products,
        });
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch failed:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
}

// Get all category from backend
export const getAllCategory = () => async (dispatch) => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });

      const response = await axios.get(`${HOSTED_URL}${GetAllCategoryUrl}`);

      if (response.data.success) {
        dispatch({
          type: "FETCH_CATEGORY_SUCCESS",
          payload: response.data.data, // Adjust based on API structure
        });
      } else {
        dispatch({
          type: "FETCH_CATEGORY_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch failed:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
  };


export const getAllSubCategory = () => async (dispatch) => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });

      const response = await axios.get(`${HOSTED_URL}${GetAllSubCategoryUrl}`);

      if (response.data.success) {
        dispatch({
          type: "FETCH_SUB_CATEGORY_SUCCESS",
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch fairled:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
  };