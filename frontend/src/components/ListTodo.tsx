import React, {useState, useEffect, FormEvent} from "react";
import useFetch from 'use-http';

interface List {
    id: string,
    todo: string
  }

type Checked = {
  index: number,
  checked: boolean
}
type SetProps = {
    list: List[],
    setList: React.Dispatch<React.SetStateAction<List[]>>,
    getList: (param:any)=>void
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

      function checkCheckBoxs () {
        var checkboxs  = document.querySelectorAll("input[type=checkbox]") ;
        // as HTMLInputElement
        console.log("Chech Boxs");
        console.log(checkboxs);

        var arr_checkboxs = Array.from(checkboxs as NodeListOf<HTMLInputElement>) ;
        arr_checkboxs.map((checkbox) => { checkbox.addEventListener('change', () => {
          console.log("onChange");
          
          if (checkbox.checked) {
            const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement  ;
            text.style.display = 'block';
            console.log("True");
          } 
          else {
            const text = checkbox.parentElement?.parentElement?.querySelector('.editContent') as HTMLElement  ;
            text.style.display = 'none';
            console.log("False");

          }
        })});

        
      }
      useEffect (()=> {
        checkCheckBoxs ();
      }, [])
    return (
        <>

            <div className='list-content'>
                {/* {loading && <p>Loading ...</p>} */}
                {error && <p>{error.message}</p>}

                {list && list.map((item, index) =>
                <div className='items' key={item.id} id={item.id}>

                    <span className="item-wrapper">
                      <input type='checkbox' className="checkbox"/>
                      {
                          (edit && (editId === item.id)) 
                          ? 
                          <form onSubmit={handleSubmitEdit}>
                          <input type='text' placeholder={item.todo} onChange={(e) => setEditList(e.target.value)} />
                          </form> : <p>{item.todo}</p>
                      }
                    </span>

                                        
                    <div className='editContent'>
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
                </div>
                )}
            </div>
        </>
    ) 
}