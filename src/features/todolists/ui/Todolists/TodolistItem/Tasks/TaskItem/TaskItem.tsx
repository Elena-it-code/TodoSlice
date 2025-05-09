import Checkbox from "@mui/material/Checkbox"
import { EditableSpan } from "@/common/components"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import ListItem from "@mui/material/ListItem"
import { deleteTaskTC, updateTaskTC } from "@/features/todolists/model/tasks-slice.ts"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles.ts"
import { useAppDispatch } from "@/common/hooks"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist }: Props) => {
  const { id, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId: id, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    dispatch(
      updateTaskTC({
        todolistId: id,
        taskId: task.id,
        domainModel: { status: newStatusValue ? TaskStatus.Completed : TaskStatus.New },
      }),
    )
  }

  const changeTaskTitle = (title: string) => {
    dispatch(
      updateTaskTC({
        todolistId: id,
        taskId: task.id,
        domainModel: { title },
      }),
    )
  }

  const isTaskCompleted = task.status === TaskStatus.Completed
  const disabled = entityStatus === "loading"
  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={deleteTask} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
