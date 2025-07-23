import { instance } from "@/common/instance"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"
import { DomainTodolist } from "@/features/todolists/lib/types"

export const todolistApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTodolists: builder.query<DomainTodolist[], void>({
        query: () => "/todo-lists", // 1 вар. короткая запись
        transformResponse: (todolists: Todolist[]) => {
          return todolists.map((tl) => {
            return { ...tl, filter: "all", entityStatus: "idle" }
          })
        },
        providesTags: [{ type: "Todolist" }],
      }),
      addTodolist: builder.mutation<BaseResponse<{ item: Todolist }>, string>({
        query: (title) => {
          return {
            method: "POST",
            url: "/todo-lists",
            body: { title },
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      deleteTodolist: builder.mutation<BaseResponse, string>({
        query: (id) => {
          return {
            method: "DELETE",
            url: `/todo-lists/${id}`,
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      changeTodolistTitle: builder.mutation<BaseResponse, { id: string; title: string }>({
        query: ({ id, title }) => {
          return {
            method: "PUT",
            url: `/todo-lists/${id}`,
            body: { title },
          }
        },
        invalidatesTags: ["Todolist"],
      }),
    }
  },
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistApi

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
