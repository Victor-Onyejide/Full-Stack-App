import React, { useState } from "react";
import useFetch from 'use-http';
const _ = require('lodash');
interface List {
  id: string,
  todo: string
}

type SetProps = {
  list: List[],
  setList: React.Dispatch<React.SetStateAction<List[]>>,
  getList: (param: List[]) => void
}

export default function ListTodo({ list, setList }: SetProps) {
  const HOST = 'http://localhost:5000';
  const { loading, response, error, del, patch } = useFetch(HOST)
  const [counter, setCounter] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [editList, setEditList] = useState<string>('');
  const [display, setDisplay] = useState<string>('none');
  const [selected, setSelected] = useState<string[]>([]);


  function handleSubmitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

  }

  async function deleteTodo(id: string) {
    const deleteId = await del(`/list/${id}`);
    if (response.ok) {
      const filter = list.filter((item) => item.id !== deleteId[0])
      setList(filter)
    }
  }

  async function deleteAllTodo() {
    const deleteAllId = await del(`/list/${selected}`)
    if(response.ok){
      for (let i = 0; i < selected.length; i++) {
        list = list.filter((item) => item.id !== deleteAllId[i])
      }
      setList(list)

    }
    setDisplay('none');

  }

  async function editToDo(id: string) {
    if (editList !== '') {
      const todo = editList
      const updatedTodo: List = await patch(`/list/${id}`, { todo })

      if (response.ok) {
        const updateList = list.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
        setList(updateList)
        setEditList('')
      }
    }
    setEdit(false)
  }

  function checkCheckBoxs(id:string) {
    var checkboxs = document.querySelectorAll("input[type=checkbox]");
    var arr_checkboxs = Array.from(checkboxs as NodeListOf<HTMLInputElement>);
    
    arr_checkboxs.map((checkbox) => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement;
          text.style.display = 'block';
          setCounter(counter + 1);
          setSelected([...selected,id])
        }
        else {
          const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement;
          text.style.display = 'none';
          setCounter(counter - 1);
          const filter = selected.filter((item) => item !== id);
          setSelected(filter);
        }
        
      })
    });

    if (counter > 1) {
      setDisplay('block');
    }

    else {
      setDisplay('none');
    } 


  }


  return (

    <div className="list-content-wrapper">
      <i className="fas fa-trash" style={{ display: `${display}` }} onClick={deleteAllTodo}></i>
      {loading && <p className="loading">loading ...</p>}
      {error && <p className="error">Something Went Wrong</p>}


      <div className='list-content'>


        {list && list.map((item) =>
          <div className='items' key={item.id} id={item.id}>

            <span className="text-wrapper">
              <input type='checkbox' className="checkbox" onChange={() => checkCheckBoxs(item.id)}/>
              {
                (edit && (editId === item.id))
                  ?
                  <form onSubmit={handleSubmitEdit}>
                    <input type='text' placeholder={item.todo} onChange={(e) => setEditList(e.target.value)} />
                  </form> : <p>{item.todo}</p>
              }
            </span>

            <div className='editContent' id={item.id}>
              {edit && (editId === item.id) ? <button onClick={() => editToDo(item.id)}>Edit</button> :
                <>
                  <span className='edit' onClick={() => { setEdit(toggle => !toggle); setEditId(item.id) }}>
                    <i className="fas fa-pen"></i>
                  </span>
                  <span className='delete' onClick={() => deleteTodo(item.id)}>
                    <button className="btn-done">Done</button>
                  </span>
                </>
              }
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

