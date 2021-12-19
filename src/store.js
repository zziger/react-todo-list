import { configureStore } from '@reduxjs/toolkit';
import todoListSlice from './features/todoList/todoListSlice';
import { loadState, saveState } from './localStorage';

export const store = configureStore({
    reducer: {
        todoList: todoListSlice
    },
    devTools: true,
    preloadedState: loadState()
});

store.subscribe(() => {
    saveState(store.getState());
});