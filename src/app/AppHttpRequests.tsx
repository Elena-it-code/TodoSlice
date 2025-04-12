import {type ChangeEvent, type CSSProperties, useEffect, useState} from 'react'
import Checkbox from '@mui/material/Checkbox'

import {CreateItemForm, EditableSpan} from "@/common/components";
import {BaseResponse} from "@/common/types";
import {instance} from "@/common/instance/instance.ts";


export const AppHttpRequests = () => {
    const [todolists, setTodolists] = useState<Todolist[]>([])
    const [tasks, setTasks] = useState<any>({})

    useEffect(() => {
        instance.get<Todolist[]>('/todo-lists')
            .then(res => setTodolists(res.data))
    }, [])

    const createTodolist = (title: string) => {
        instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', {title})
            .then(res => {
                const todolist = res.data.data.item
                setTodolists([todolist, ...todolists])
            })
    }

    const deleteTodolist = (id: string) => {
        instance.delete<BaseResponse>(`/todo-lists/${id}`)
            .then(() => {
                setTodolists(todolists.filter(tl => tl.id !== id))
            })
    }

    const changeTodolistTitle = (id: string, title: string) => {
        instance.put<BaseResponse>(`/todo-lists/${id}`, {title})
            .then(() => {
                setTodolists(todolists.map(todolist => todolist.id === id ? {...todolist, title} : todolist))
            })
    }

    const createTask = (todolistId: string, title: string) => {
    }

    const deleteTask = (todolistId: string, taskId: string) => {
    }

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: any) => {
    }

    const changeTaskTitle = (task: any, title: string) => {
    }

    return (
        <div style={{margin: '20px'}}>
            <CreateItemForm onCreateItem={createTodolist}/>
            {todolists.map((todolist) => (
                <div key={todolist.id} style={container}>
                    <div>
                        <EditableSpan value={todolist.title}
                                      onChange={title => changeTodolistTitle(todolist.id, title)}/>
                        <button onClick={() => deleteTodolist(todolist.id)}>x</button>
                    </div>
                    <CreateItemForm onCreateItem={title => createTask(todolist.id, title)}/>
                    {tasks[todolist.id]?.map((task: any) => (
                        <div key={task.id}>
                            <Checkbox checked={task.isDone}
                                      onChange={e => changeTaskStatus(e, task)}/>
                            <EditableSpan value={task.title}
                                          onChange={title => changeTaskTitle(task, title)}/>
                            <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

const container: CSSProperties = {
    border: '1px solid black',
    margin: '20px 0',
    padding: '10px',
    width: '300px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
}

export type Todolist = {
    addedDate: string
    id: string
    order: number
    title: string
}