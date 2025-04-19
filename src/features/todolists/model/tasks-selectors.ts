import { RootState } from "@/app/store.ts"
import { TasksState } from "@/features/todolists/model/tasks-slice.ts"

export const selectTasks = (state: RootState): TasksState => state.tasks
