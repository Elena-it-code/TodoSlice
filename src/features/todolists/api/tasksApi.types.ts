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
  error: string | null
  totalCount: number
  items: DomainTask[]
}

// тип для запроса обновления статуса Таски и Title(а)
export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export type DeleteTaskArgs = {
  todolistId: string
  taskId: string
}

export type CreateTaskArgs = {
  todolistId: string
  title: string
}
