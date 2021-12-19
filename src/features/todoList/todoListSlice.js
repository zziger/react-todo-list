import { createSlice } from '@reduxjs/toolkit';

const initialStore = {
    tasks: [],
    id: 0
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState: initialStore,
    reducers: {
        addTask: (state, action) => {
            action.payload.id = state.id++;
            state.tasks = [
                ...state.tasks,
                action.payload
            ]
        }
    }
});

export const { addTask } = counterSlice.actions;

export const selectTasks = (state) => state.counter.tasks;

export default counterSlice.reducer;