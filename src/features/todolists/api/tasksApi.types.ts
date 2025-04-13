export type DomainTask = {
  description: string | null
  title: string
  status: number
  priority: number
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

// тип для запроса обновления статуса Таски
export type UpdateTaskModel = {
  description: string | null
  title: string
  status: number
  priority: number
  startDate: string | null
  deadline: string | null
}
