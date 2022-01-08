import { configureStore } from '@reduxjs/toolkit';
import { StateWithHistory } from 'redux-undo';
import todoListSlice, { TodoListStore } from './features/todoList/todoListSlice';
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

export type RootStore = {
    todoList: StateWithHistory<TodoListStore>
};