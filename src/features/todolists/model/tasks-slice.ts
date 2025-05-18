import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import {
  CreateTaskArgs,
  DeleteTaskArgs,
  DomainTask,
  domainTaskSchema,
  UpdateTaskModel,
} from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store.ts"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { clearDataAC } from "@/common/actions"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          domainTaskSchema.array().parse(res.data.items) // 💎 ZOD
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          handleServerNetworkError(thunkAPI.dispatch, error)
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (args: CreateTaskArgs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: DeleteTaskArgs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.deleteTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return args // Возвращаем аргументы для редьюсера
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        // код обработки редьюсера для deleteTaskTC
        fulfilled: (state, action) => {
          // 1. Получаем массив задач для конкретного тудулиста
          const tasks = state[action.payload.todolistId]
          // 2. Находим индекс удаляемой задачи в массиве
          const taskIndex = tasks.findIndex((task) => task.id === action.payload.taskId)
          // 3. Проверяем, что задача найдена (индекс не -1)
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1)
          }
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        args: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = args
        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        }

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const allTodolistTasks = state[action.payload.task.todoListId]
          const taskIndex = allTodolistTasks.findIndex((task) => task.id === action.payload.task.id)
          if (taskIndex !== -1) {
            allTodolistTasks[taskIndex] = action.payload.task
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [] // Пустой массив задач для будущего наполнения под новый тудулист. ✅
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(clearDataAC, () => {
        return {}
      })
  },
})

export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
export const { deleteTaskTC, createTaskTC, fetchTasksTC, updateTaskTC } = tasksSlice.actions

export type TasksState = Record<string, DomainTask[]>
