import React, {useState} from "react";
import useFetch from 'use-http';

interface List {
    id: string,
    todo: string
  }


type SetProps = {
    list: List[],
    setList: React.Dispatch<React.SetStateAction<List[]>>,
    getList: ()=>void
}

export default function ListTodo ({list, setList}: SetProps) {
    const HOST = 'http://localhost:5000'
    // const PATH = '/list'
    const { loading, response, error, get, del, patch } = useFetch(HOST)
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>('');
    const [editList, setEditList] = useState<string>('');

    
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
    return (
        <>

            <div className='list-content'>
                {/* {loading && <p>Loading ...</p>} */}
                {error && <p>{error.message}</p>}
                {list && list.map((item) =>
                <div className='items' key={item.id} id={item.id}>
                    <span>
                    <input type='checkbox' onClick={() =>{ setShowEdit(true); setEditId(item.id) }  }/>
                    {
                        (edit && (editId === item.id)) 
                        ? 
                        <form onSubmit={handleSubmitEdit}>
                        <input type='text' placeholder={item.todo} onChange={(e) => setEditList(e.target.value)} />
                        </form> : <p>{item.todo}</p>
                    }
                    </span>

                    {
                      showEdit && <div className='editContent'>
                      {edit && (editId === item.id) ? <button onClick={() => editToDo(item.id)}>Edit</button> :
                      <> 
                          <span className='edit' onClick={() => { setEdit(toggle => !toggle); setEditId(item.id) }}>
                              <i className="fas fa-pen"></i>
                          </span>
                          <span className='delete' onClick={() => deleteTodo(item.id)}>
                              <i className="fas fa-trash"></i>
                          </span>
                      </>
                      }
                      </div>
                    }
                    

                </div>
                )}

            </div>

        </>
    ) 
    
}