import React from 'react';
import TodoListStore from './stores/TodoListStore';

export const store = {
    todoList: TodoListStore
};

const StoreContext = React.createContext(store);

export default StoreContext;