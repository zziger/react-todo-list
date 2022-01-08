import { createSlice } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { RootStore } from '../../store';

export interface TodoListTask { id: number, name: string, state: boolean };
export interface TodoListStore { tasks: TodoListTask[], id: number };

const initialStore: TodoListStore = {
    tasks: [],
    id: 0
};

export const todoListSlice = createSlice({
    name: 'todoList',
    initialState: initialStore,
    reducers: {
        addTask: (state, action) => {
            action.payload.id = state.id++;
            state.tasks.push(action.payload);
        },
        removeAll: (state) => {
            state.tasks = [];
        },
        removeDone: (state) => {
            state.tasks = state.tasks.filter((e) => !e.state);
        },
        toggleActive: (state, action) => {
            const task = state.tasks.find(e => e.id === action.payload);
            if (task) task.state = !task.state;
        },
        remove: (state, action) => {
            state.tasks = state.tasks.filter((e) => e.id != action.payload);
        },
        rename: (state, action) => {
            const { id, name } = action.payload;
            const task = state.tasks.find(e => e.id === id);
            if (task) task.name = name;
        },
        swap: (state, action) => {
            const [id1, id2] = action.payload;
            const index1 = state.tasks.findIndex(e => e.id === id1);
            const index2 = state.tasks.findIndex(e => e.id === id2);
            [ state.tasks[index1], state.tasks[index2] ] = [ state.tasks[index2], state.tasks[index1] ];
        }
    }
});

export const { addTask, removeAll, removeDone, toggleActive, remove, rename, swap } = todoListSlice.actions;

export const selectTasks = (state: RootStore) => state.todoList.present.tasks;
export const selectCanUndo = (state: RootStore) => state.todoList.past.length;
export const selectCanRedo = (state: RootStore) => state.todoList.future.length;

export default undoable(todoListSlice.reducer, { limit: 10 });