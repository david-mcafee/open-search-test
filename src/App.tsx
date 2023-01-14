import { useEffect, useState } from "react";
import "./App.css";
import { DataStore, Predicates } from "aws-amplify";
import { Todo, Author } from "./models";

function App() {
  const [todos, setTodos] = useState([]);
  const [authors, setAuthors] = useState([]);

  function clearState() {
    setTodos([]);
    setAuthors([]);
  }

  function addTodo() {
    DataStore.save(
      new Todo({
        content: `content ${Date.now()}`,
      })
    );
  }

  function addAuthor() {
    DataStore.save(
      new Author({
        firstName: `firstName ${Date.now()}`,
        lastName: `lastName ${Date.now()}`,
      })
    );
  }

  function onDeleteAll() {
    DataStore.delete(Todo, Predicates.ALL);
    DataStore.delete(Author, Predicates.ALL);
  }

  async function getTodos() {
    const _todos = await DataStore.query(Todo);
    //@ts-ignore
    setTodos(_todos);
    console.log("Todos", _todos);
  }

  async function getAuthors() {
    const _authors = await DataStore.query(Author);
    //@ts-ignore
    setAuthors(_authors);
    console.log("Todos", _authors);
  }

  useEffect(() => {
    const subscription1 = DataStore.observe(Todo).subscribe(() => {
      getTodos();
      DataStore.start();
    });

    const subscription2 = DataStore.observe(Author).subscribe(() => {
      getAuthors();
      DataStore.start();
    });

    return () => {
      subscription1.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={getTodos}>query todos</button>
          <button onClick={getAuthors}>query authors</button>
          <button onClick={clearState}>clear state</button>
          <button onClick={addTodo}>add todo</button>
          <button onClick={addAuthor}>add author</button>
          <button onClick={onDeleteAll}>delete all</button>
          <button onClick={async () => await DataStore.start()}>Start</button>
          <button onClick={async () => await DataStore.stop()}>Stop</button>
          <button onClick={async () => await DataStore.clear()}>Clear</button>
          <pre>todos: {JSON.stringify(todos, null, 2)}</pre>
          <pre>authors: {JSON.stringify(authors, null, 2)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
