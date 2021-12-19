import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/todoList/todoListSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer
    },
    devTools: true
});