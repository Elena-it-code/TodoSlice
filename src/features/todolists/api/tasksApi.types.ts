import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod"

export type DomainTask = z.infer<typeof domainTaskSchema>

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string().datetime({ local: true }),
})

export type GetTasksResponse = {
  error: Nullable<string>
  totalCount: number
  items: DomainTask[]
}

// тип для запроса обновления статуса Таски и Title(а)
export type UpdateTaskModel = {
  description: Nullable<string>
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: Nullable<string>
  deadline: Nullable<string>
}

export type Nullable<T> = T | null

export type DeleteTaskArgs = {
  todolistId: string
  taskId: string
}

export type CreateTaskArgs = {
  todolistId: string
  title: string
}
