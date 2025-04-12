import {instance} from "@/common/instance/instance.ts";
import {Todolist} from "@/features/todolists/api/todolistsApi.types.ts";
import {BaseResponse} from "@/common/types";


export const todolistApi = {
    getTodolists(){
        return instance.get<Todolist[]>('/todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<BaseResponse<{ item: Todolist }>>('/todo-lists', {title})
    },
    deleteTodolist(id: string){
        return instance.delete<BaseResponse>(`/todo-lists/${id}`)
    },
    changeTodolistTitle(payload: {id: string, title: string}){
        const { id, title } = payload;
        return instance.put<BaseResponse>(`/todo-lists/${id}`, {title})
    }
}