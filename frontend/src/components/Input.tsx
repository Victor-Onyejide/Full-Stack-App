import React, { useState, useEffect } from "react";
import useFetch from 'use-http';


const HOST = 'http://localhost:5000'
const PATH = '/list'

interface List {
    id: string,
    todo: string
  }

type SetProps = {
    list: List[],
    setList: React.Dispatch<React.SetStateAction<List[]>>
}
export default function Input ({list,setList}: SetProps) {
    const [todo, setTodo] = useState<string>('');
    const {error,response,  post } = useFetch(HOST);

    
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        addList();
        (document.getElementById('input') as HTMLInputElement).value = '';
    
      }
    
    async function addList() {
        const newItem: List = await post(PATH, { todo });
        if (response.ok) {
          setList([...list, newItem])

        }
        else {
            console.log(error)
        }
     }
    return(
    <>
        <div className='addTodo'>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="text"
                id="input"
                onChange={(e) => setTodo(e.target.value)}
            />
            <button className='submit'><i className="fas fa-arrow-up"></i></button>
            </form>
        </div>
    </>
    )
}