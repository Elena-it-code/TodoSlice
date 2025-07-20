import { instance } from "@/common/instance"
import {
  CreateTaskArgs,
  DeleteTaskArgs,
  DomainTask,
  GetTasksResponse,
  UpdateTaskModel,
} from "@/features/todolists/api/tasksApi.types.ts"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getTasks: builder.query<GetTasksResponse, string>({
        query: (todolistId) => ({
          method: "GET",
          url: `/todo-lists/${todolistId}/tasks`,
        }),
        providesTags: [{ type: "Task" }],
      }),
      createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, CreateTaskArgs>({
        query: ({ todolistId, title }) => ({
          method: "POST",
          url: `/todo-lists/${todolistId}/tasks`,
          body: { title },
        }),
        invalidatesTags: ["Task"],
      }),
      updateTask: builder.mutation<
        BaseResponse<{ item: DomainTask }>,
        {
          todolistId: string
          taskId: string
          model: UpdateTaskModel
        }
      >({
        query: ({ todolistId, taskId, model }) => ({
          method: "PUT",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
          body: model,
        }),
        invalidatesTags: ["Task"],
      }),
      deleteTask: builder.mutation<BaseResponse, DeleteTaskArgs>({
        query: ({ todolistId, taskId }) => ({
          method: "DELETE",
          url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        }),
        invalidatesTags: ["Task"],
      }),
    }
  },
})

export const { useCreateTaskMutation, useGetTasksQuery, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi

// ❌ ❌ ❌
export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: CreateTaskArgs) {
    const { todolistId, title } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { todolistId, taskId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(payload: DeleteTaskArgs) {
    const { todolistId, taskId } = payload
    return instance.delete<BaseResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
