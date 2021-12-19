import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, selectTasks } from './features/todoList/todoListSlice';

function TodoComponent(props) {
  const [edit, setEdit] = React.useState(false);

  function onChange() {
    props.changeState(props.element.id);
  }

  function remove() {
    props.removeElement(props.element.id);
  }

  function toggleEdit() {
    setEdit(!edit);
  }

  function onNameChange(e) {
    props.editElement(props.element.id, e.currentTarget.value);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") toggleEdit();
  }

  return <label>
    <span>
      <input type="checkbox" checked={props.element.state} onChange={onChange} />
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
      <button onClick={() => props.moveElement(props.element.id, -1)} disabled={props.index === 0}>↑</button>
      <button onClick={() => props.moveElement(props.element.id, 1)} disabled={props.index === (props.listCount - 1)}>↓</button>
      <button onClick={toggleEdit}>Edytuj</button>
      <button onClick={remove}>Usuń</button>
    </span>
  </label>
}

let id = 0;
function App() {
  const [text, setText] = React.useState("");
  // const [list, setListInternal] = React.useState([]);
  const [tab, setTab] = React.useState("all");
  const dispatch = useDispatch();
  const list = useSelector(selectTasks);

  React.useEffect(() => {
    if ("items" in localStorage) {
      // const taskList = JSON.parse(localStorage.getItem("items"));
      // const idList = taskList.map(e => e.id);
      // id = Math.max(0, ...idList) + 1;
      // setListInternal(taskList);
    }
  }, []);

  function setList(element) {
    // setListInternal(element);
    // localStorage.setItem("items", JSON.stringify(element));
  }

  function onFormSend(e) {
    e.preventDefault();

    if (!text.trim()) {
      alert("Input text");
      return;
    }

    dispatch(addTask({ state: false, name: text }));
    // setList(
    //   [...list, { state: false, name: text, id: id++ }]
    // );
    setText("");
  }

  function changeState(id) {
    const newList = [...list];
    const element = newList.find(e => e.id === id);
    element.state = !element.state;
    setList(newList);
  }

  function removeElement(id) {
    const newList = list.filter(e => e.id !== id);
    setList(newList);
  }

  function editElement(id, name) {
    const newList = [...list];
    const element = newList.find(e => e.id === id);
    element.name = name;
    setList(newList);
  }

  const doneList = list.filter(e => e.state);
  const undoneList = list.filter(e => !e.state);

  let currentList = list;

  if (tab === "done") currentList = doneList;
  if (tab === "undone") currentList = undoneList;

  function moveElement(id, mod) {
    const newList = [...list];
    const currentFirstIndex = currentList.findIndex(e => e.id === id);
    const firstIndex = list.findIndex(e => e.id === id);
    const secondIndex = list.findIndex(e => e.id === currentList[currentFirstIndex + mod].id);
    [newList[firstIndex], newList[secondIndex]] = [newList[secondIndex], newList[firstIndex]];
    setList(newList);
  }

  function removeDone() {
    const newList = list.filter(e => !e.state);
    setList(newList);
  }

  function removeAll() {
    setList([]);
  }

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
            changeState={changeState} 
            removeElement={removeElement} 
            editElement={editElement}
            moveElement={moveElement} />
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
        <button onClick={removeDone}>Usuń wykonane</button>
        <button onClick={removeAll}>Usuń wszystkie</button>
      </div>
    </div>
  );
}

export default App;
