// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
// import your reducers here
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
