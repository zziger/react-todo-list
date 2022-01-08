import { TodoListStore } from "./features/todoList/todoListSlice";
import { RootStore } from "./store";

export function loadState(): RootStore | undefined {
    if (!("items" in localStorage)) return undefined;
    try {
        const data = localStorage.getItem("items") ?? "";
        return JSON.parse(data);
    } catch(e) {
        return undefined;
    }
}

export function saveState(state: RootStore) {
    localStorage.setItem("items", JSON.stringify(state));
}