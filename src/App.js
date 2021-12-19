import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, selectTasks, removeAll, removeDone, toggleActive, remove, rename, swap } from './features/todoList/todoListSlice';
import { ActionCreators } from 'redux-undo';

function TodoComponent(props) {
  const [edit, setEdit] = React.useState(false);
  const [editField, setEditField] = React.useState("");
  const dispatch = useDispatch();

  function startEdit() {
    setEditField(props.element.name);
    setEdit(true);
  }

  function cancelEdit() {
    setEdit(false);
  }

  function stopEdit() {
    if (!editField.trim()) {
      alert("Input text");
      return;
    }

    setEdit(false);
    dispatch(rename({ id: props.element.id, name: editField }));
  }

  function onKeyDown(e) {
    if (e.key === "Enter") stopEdit();
    if (e.key === "Escape") cancelEdit();
  }

  return <label>
    <span>
      <input type="checkbox" checked={props.element.state} onChange={() => dispatch(toggleActive(props.element.id))} />
      <span className='nazwa' onDoubleClick={startEdit}>
        {
          edit 
            ? <input 
                type="text"
                autoFocus={true}
                value={editField}
                onChange={(e) => setEditField(e.currentTarget.value)}
                onBlur={stopEdit} 
                onKeyDown={onKeyDown} /> 
            : props.element.name
        }
      </span>
    </span>
    <span>
      <button onClick={() => dispatch(swap([ props.element.id, props.elementUp.id ]))} disabled={!props.elementUp}>↑</button>
      <button onClick={() => dispatch(swap([ props.element.id, props.elementDown.id ]))} disabled={!props.elementDown}>↓</button>
      <button onClick={startEdit}>Edytuj</button>
      <button onClick={() => dispatch(remove(props.element.id))}>Usuń</button>
    </span>
  </label>
}

function App() {
  const [text, setText] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const dispatch = useDispatch();
  const list = useSelector(selectTasks);

  function onFormSend(e) {
    e.preventDefault();

    if (!text.trim()) {
      alert("Input text");
      return;
    }

    dispatch(addTask({ state: false, name: text }));
    setText("");
  }

  const doneList = list.filter(e => e.state);
  const undoneList = list.filter(e => !e.state);

  let currentList = list;

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
        <button onClick={() => dispatch(ActionCreators.undo())}>Undo</button>
        <button onClick={() => dispatch(ActionCreators.redo())}>Redo</button>
        <button onClick={() => dispatch(removeDone())}>Usuń wykonane</button>
        <button onClick={() => dispatch(removeAll())}>Usuń wszystkie</button>
      </div>
    </div>
  );
}

export default App;
