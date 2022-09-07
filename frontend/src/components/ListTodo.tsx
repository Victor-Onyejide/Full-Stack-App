import React, { useState, useEffect } from "react";
import useFetch from 'use-http';

interface List {
  id: string,
  todo: string
}

type SetProps = {
  list: List[],
  setList: React.Dispatch<React.SetStateAction<List[]>>,
  getList: (param: any) => void
}

export default function ListTodo({ list, setList }: SetProps) {
  const HOST = 'http://localhost:5000';
  const { loading, response, error, del, patch } = useFetch(HOST)
  const [counter, setCounter] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [editList, setEditList] = useState<string>('');
  const [display, setDisplay] = useState<string>('none');
  var [arrState, setArrState] = useState<any[]>([]);
  const arrIds: any[] = [];



  function handleSubmitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

  }


  async function deleteTodo(id: string) {
    const deleteId = await del(`/list/${id}`);
    if (response.ok) {
      const filter = list.filter((item) => item.id !== deleteId)
      setList(filter)
    }
  }

  async function deleteAllTodo() {
    // let arr_id = ['35249fe2-e0a0-4449-8f32-2dbd2fa1da96', 'b870fb4a-dde5-48c1-b4e6-c25e3283ab03', 'c2959bb7-106c-4db8-8350-27193b4d580c'];
    console.log("Selected Todos")
    console.log(arrState)
    // const deleteIds = await del(`/list/${arrState}`);
    // if (response.ok) {
      for (let i = 0; i < arrState.length; i++) {
        list = list.filter((item) => item.id !== arrState[i])
      }
      console.log('List')
      console.log(list)

      setList(list)

      // alert('Ok')
    // }
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
    // console.log(arrState)

    var checkboxs = document.querySelectorAll("input[type=checkbox]");
    var arr_checkboxs = Array.from(checkboxs as NodeListOf<HTMLInputElement>);

    arr_checkboxs.map((checkbox) => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement;
          text.style.display = 'block';
          setCounter(counter + 1);
          // console.log(text.id);
          // setArrIds([...arrIds, text.id]); // the array is not adding properly
          // arrIds.push([text.id])
          setArrState([...arrState,id])

        }
        else {
          const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement;
          text.style.display = 'none';
          setCounter(counter - 1);
          // console.log(counter);
          // const filter = arrState.filter((item) => item.id !== id);
          // // setArrIds(filter); // issue
          // console.log('removed')
          // setArrState(filter);
          // console.log('list');
          // console.log(arrState);
        }
        
      })


    // let arr_id = ['2a4a8ca9-264b-47f8-9036-a6905ec1b1d3', '79e672b6-7e76-4cf2-bc8d-86086b08b69c',
    //  'b2f1ea09-0099-448e-8c96-4e7deb05d1a1','63dea50a-6d29-49ce-a7c4-8f7571d28008'];
    // console.log(arrIds === arr_id)
    });

    if (counter > 1) {
      setDisplay('block');
    }
    else if (counter <= 1) {
      setDisplay('none');
    }
    else {
      setCounter(0);
    }

  }

  // useEffect (()=> {
  //   checkCheckBoxs()
  //   console.log('mounted')
  // }, [])

  return (

    <div className="list-content-wrapper">
      <i className="fas fa-trash" style={{ display: `${display}` }} onClick={deleteAllTodo}></i>

      <div className='list-content'>
        {/* {loading && <p>Loading ...</p>} */}

        {error && <p>{error.message}</p>}

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