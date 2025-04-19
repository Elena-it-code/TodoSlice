import List from "@mui/material/List"
import { selectTasks } from "@/features/todolists/model/tasks-selectors.ts"
import { Todolist } from "@/features/todolists/model/todolists-slice.ts"
import { TaskItem } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx"
import { useAppSelector } from "@/common/hooks"

type Props = {
  todolist: Todolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.isDone)
  }

  return (
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} todolist={todolist} />
          ))}
        </List>
      )}
    </>
  )
}
