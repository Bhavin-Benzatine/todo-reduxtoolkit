import { configureStore } from '@reduxjs/toolkit';
import authReducers from '../reducers/authReducers';
import todoReducers from '../reducers/todoReducers';

export const store = configureStore({
  reducer: {
    user : authReducers,
    todos : todoReducers
  },
});
