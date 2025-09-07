// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userReducer } from "./reducers/userReducer";
import { adminReducer } from "./reducers/adminReducer/adminReducer";
import { manageReducer } from "./reducers/adminReducer/manageReducer";

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  manage:manageReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
