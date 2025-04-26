import { TaskStatus } from "@/common/enums"
import { TaskPriority } from "@/common/enums/enums.ts"

export type DomainTask = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
  id: string
  todoListId: string
  order: number
  addedDate: string
}

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
