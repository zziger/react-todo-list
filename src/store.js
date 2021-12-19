import { configureStore } from '@reduxjs/toolkit';
import todoListSlice from './features/todoList/todoListSlice';

export const store = configureStore({
    reducer: {
        todoList: todoListSlice
    },
    devTools: true
});