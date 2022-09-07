import React, { useState, useEffect } from 'react';
import './App.css';
import useFetch from 'use-http';
import Input from './components/Input';
import ListTodo from './components/ListTodo';

interface List {
  id: string,
  todo: string
}


function App() {
  const HOST = 'http://localhost:5000'
  const PATH = '/list'
  const { loading, response, error, get} = useFetch(HOST)

  const [list, setList] = useState<List[]>([]);

  async function getList() {
    const data: List[] = await get(PATH)
    if (response.ok) {
      setList(data)
    } else {
      console.log(error)
    }
  }
  
  useEffect(() => {
    getList()
  }, [])


  return (
    <div className="App">
      <header>
        Todo
      </header>
      <ListTodo list={list} setList={setList} getList={getList} />
      <Input list={list} setList={setList}/>
    </div>
  );
}

export default App;
