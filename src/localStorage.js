export function loadState() {
    if (!("items" in localStorage)) return undefined;
    try {
        return JSON.parse(localStorage.getItem("items"));
    } catch(e) {
        return undefined;
    }
}

export function saveState(state) {
    localStorage.setItem("items", JSON.stringify(state));
}