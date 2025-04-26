import Checkbox from "@mui/material/Checkbox"
import { EditableSpan } from "@/common/components"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import ListItem from "@mui/material/ListItem"
import { changeTaskStatusTC, changeTaskTitleAC, deleteTaskTC } from "@/features/todolists/model/tasks-slice.ts"
import type { ChangeEvent } from "react"

import { getListItemSx } from "./TaskItem.styles.ts"
import { useAppDispatch } from "@/common/hooks"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"

type Props = {
  task: DomainTask
  todolist: Todolist
}

export const TaskItem = ({ task, todolist }: Props) => {
  const { id } = todolist

  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId: id, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    //const newStatusValue = e.currentTarget.checked
    //dispatch(changeTaskStatusTC({ todolistId: id, taskId: task.id, isDone: newStatusValue }))
    // const model: UpdateTaskModel = {
    //   status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
    //   title: task.title,
    //   priority: task.priority,
    //   startDate: task.startDate,
    //   deadline: task.deadline,
    //   description: task.description,
    // }
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(changeTaskStatusTC({ todolistId: id, taskId: task.id, status }))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({ todolistId: id, taskId: task.id, title }))
  }

  const isTaskCompleted = task.status === TaskStatus.Completed
  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
