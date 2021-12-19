import logo from './logo.svg';
import './App.css';
import React from 'react';
import StoreContext from './store';
import { observer } from 'mobx-react'

const TodoComponent = observer(function TodoComponent(props) {
  const [edit, setEdit] = React.useState(false);
  const store = React.useContext(StoreContext);

  function toggleEdit() {
    setEdit(!edit);
  }

  function onNameChange(e) {
    store.todoList.rename(props.element.id, e.currentTarget.value);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") toggleEdit();
  }

  return <label>
    <span>
      <input type="checkbox" checked={props.element.state} onChange={() => store.todoList.toggleState(props.element.id)} />
      <span className='nazwa' onDoubleClick={toggleEdit}>
        {
          edit 
            ? <input 
                type="text"
                autoFocus={true}
                value={props.element.name}
                onChange={onNameChange}
                onBlur={toggleEdit} 
                onKeyDown={onKeyDown} /> 
            : props.element.name
        }
      </span>
    </span>
    <span>
      <button onClick={() => store.todoList.swap(props.element.id, props.elementUp.id)} disabled={!props.elementUp}>↑</button>
      <button onClick={() => store.todoList.swap(props.element.id, props.elementDown.id)} disabled={!props.elementDown}>↓</button>
      <button onClick={toggleEdit}>Edytuj</button>
      <button onClick={() => store.todoList.removeTask(props.element.id)}>Usuń</button>
    </span>
  </label>
})

let id = 0;
function App() {
  const [text, setText] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const store = React.useContext(StoreContext);
  const list = store.todoList.list;

  function onFormSend(e) {
    e.preventDefault();

    if (!text.trim()) {
      alert("Input text");
      return;
    }

    store.todoList.addTask({ state: false, name: text });
    setText("");
  }

  const doneList = list.filter(e => e.state);
  const undoneList = list.filter(e => !e.state);

  let currentList = list;

  function moveElement(id, mod) {
    const newList = [...list];
    const currentFirstIndex = currentList.findIndex(e => e.id === id);
    const firstIndex = list.findIndex(e => e.id === id);
    const secondIndex = list.findIndex(e => e.id === currentList[currentFirstIndex + mod].id);
    [newList[firstIndex], newList[secondIndex]] = [newList[secondIndex], newList[firstIndex]];
    setList(newList);
  }

  if (tab === "done") currentList = doneList;
  if (tab === "undone") currentList = undoneList;

  return (
    <div className="App">
      <form className="row" onSubmit={onFormSend}>
        <input type="text" value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <button type='submit'>Dodaj</button>
      </form>
      <div className='elements'>
        {currentList.map((e, i) => 
          <TodoComponent 
            key={e.id} 
            index={i} 
            listCount={currentList.length} 
            element={e} 
            elementUp={i === 0 ? null : currentList[i - 1]}
            elementDown={i === (currentList.length - 1) ? null : currentList[i + 1]} />
        )}
      </div>
      <div className='info'>
        <span>{doneList.length}/{list.length}</span>
        <div className="tabs">
          <label>
            <input type="radio" name="tab" value="all" checked={tab === "all"} onChange={() => setTab("all")} />
            Wszystkie
          </label>
          <label>
            <input type="radio" name="tab" value="done" checked={tab === "done"} onChange={() => setTab("done")} />
            Wykonane
          </label>
          <label>
            <input type="radio" name="tab" value="undone" checked={tab === "undone"} onChange={() => setTab("undone")} />
            Nie wykonane
          </label>
        </div>
      </div>
      <div className='buttons'>
        <button onClick={() => store.todoList.removeDone()}>Usuń wykonane</button>
        <button onClick={() => store.todoList.removeAll()}>Usuń wszystkie</button>
      </div>
    </div>
  );
}

export default observer(App);
