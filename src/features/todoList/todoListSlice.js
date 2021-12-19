import { createSlice } from '@reduxjs/toolkit';
import undoable from 'redux-undo';

const initialStore = {
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
            task.state = !task.state;
        },
        remove: (state, action) => {
            state.tasks = state.tasks.filter((e) => e.id != action.payload);
        },
        rename: (state, action) => {
            const { id, name } = action.payload;
            const task = state.tasks.find(e => e.id === id);
            task.name = name;
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

export const selectTasks = (state) => state.todoList.present.tasks;
export const selectCanUndo = (state) => state.todoList.past.length;
export const selectCanRedo = (state) => state.todoList.future.length;

export default undoable(todoListSlice.reducer, { limit: 10 });