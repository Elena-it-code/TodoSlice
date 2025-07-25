import List from "@mui/material/List"
import { TaskItem } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx"
import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi.ts"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx"
import { DomainTodolist } from "@/features/todolists/lib/types"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const { data, isLoading } = useGetTasksQuery(id)

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}</List>
      )}
    </>
  )
}
