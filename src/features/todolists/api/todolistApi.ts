import { instance } from "@/common/instance"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { BaseResponse } from "@/common/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"

export const todolistApi = createApi({
  reducerPath: "todolistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("API-KEY", import.meta.env.VITE_API_KEY)
      headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
    },
  }),
  endpoints: (builder) => ({
    getTodolists: builder.query<DomainTodolist[], void>({
      query: () => "/todo-lists", // 1 вар. короткая запись
      // 2 вар. записи
      // query: () => {
      //   return {
      //     method: "GET", / метод  "GET" , можно не писать, сработает по умолчанию
      //     url: "/todo-lists",
      //   }
      // },
      transformResponse: (todolists: Todolist[]) => {
        return todolists.map((tl) => {
          return { ...tl, filter: "all", entityStatus: "idle" }
        })
      },
    }),
  }),
})

export const { useGetTodolistsQuery } = todolistApi

export const _todolistApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
}
