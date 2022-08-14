import React, {useState, useEffect} from 'react';
import './App.css';
import useFetch from 'use-http'

function App() {
  interface List {
    id: string,
    todo: string
  }

type Data = {
    list: List[]
  }

  const [list, setList] = useState<List[]>();


  const HOST = 'http://localhost:5000'
  const PATH = '/list'
  let URL = HOST + PATH
  const {loading, response, error, get, post, patch, del} = useFetch(HOST)
  

  async function getList() {

    const data:List[] = await get(PATH)
    // const {list} = data
    console.log(data)
    if (response.ok){
      setList(data)
      // console.log(list)
    }
    
  }
useEffect(()=>{
  getList()
},[])
  return (
    <div className="App">
      <header>
        Todo
      </header>

      <div className='list-content'>
        {loading && <p>Loading ...</p>}
        {error && <p>{error.message}</p>}
        {list && list.map((item)=> 
          <div className='items' key={item.id}>
            {/* {radio } */}
            <p>{item.todo}</p>

            <div className='editContent'>
            </div>
            
          </div>
        )}

      </div>
     
    </div>
  );
}

export default App;
