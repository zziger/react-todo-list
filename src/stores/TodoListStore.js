import { makeAutoObservable } from 'mobx';

class TodoListStore {
    constructor() {
        makeAutoObservable(this);
    }
    
    id = 0;
    list = [];

    addTask(task) {
        task.id = this.id++;
        this.list = [...this.list, task];
    }

    removeTask(id) {
        this.list = this.list.filter(e => e.id !== id);
    }

    rename(id, name) {
        const element = this.list.find(e => e.id === id);
        element.name = name;
    }

    toggleState(id) {
        const element = this.list.find(e => e.id === id);
        element.state = !element.state;
    }

    swap(id1, id2) {
        const index1 = this.list.findIndex(e => e.id === id1);
        const index2 = this.list.findIndex(e => e.id === id2);

        [ this.list[index1], this.list[index2] ] = [ this.list[index2], this.list[index1] ];
    }

    removeDone() {
        this.list = this.list.filter(e => !e.state);
    }

    removeAll() {
        this.list = [];
    }
}

export default new TodoListStore();