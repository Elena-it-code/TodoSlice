import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { CreateTaskArgs, DeleteTaskArgs, DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskStatus } from "@/common/enums"
import { RootState } from "@/app/store.ts"
import { setStatusAC } from "@/app/app-slice.ts"

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
          thunkAPI.dispatch(setStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          thunkAPI.dispatch(setStatusAC({ status: "succeeded" }))
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          thunkAPI.dispatch(setStatusAC({ status: "failed" }))
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
      async (args: CreateTaskArgs, thunkAPI) => {
        try {
          thunkAPI.dispatch(setStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(args)
          thunkAPI.dispatch(setStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          thunkAPI.dispatch(setStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
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
          dispatch(setStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(args)
          dispatch(setStatusAC({ status: "succeeded" }))
          return args
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const taskIndex = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1)
          }
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
        const { todolistId, taskId, status } = args
        try {
          thunkAPI.dispatch(setStatusAC({ status: "loading" }))
          const state = thunkAPI.getState() as RootState
          const tasks = state.tasks
          const tasksForTodolist = tasks[todolistId]
          const currentTask = tasksForTodolist.find((task) => task.id === taskId)

          if (currentTask) {
            const model: UpdateTaskModel = {
              status: status,
              title: currentTask.title,
              priority: currentTask.priority,
              startDate: currentTask.startDate,
              deadline: currentTask.deadline,
              description: currentTask.description,
            }
            await tasksApi.updateTask({ todolistId, taskId, model })
            thunkAPI.dispatch(setStatusAC({ status: "succeeded" }))
            return args
          } else {
            return thunkAPI.rejectWithValue(null)
          }
        } catch (error) {
          thunkAPI.dispatch(setStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
          if (task) {
            task.status = action.payload.status
          }
        },
      },
    ),
    changeTaskTitleTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string; title: string }, { dispatch, rejectWithValue, getState }) => {
        const { todolistId, taskId, title } = args
        try {
          dispatch(setStatusAC({ status: "loading" }))
          const state = getState() as RootState
          const tasks = state.tasks
          const tasksForTodolist = tasks[todolistId]
          const currentTask = tasksForTodolist.find((task) => task.id === taskId)
          if (currentTask) {
            const model: UpdateTaskModel = {
              status: currentTask.status,
              title,
              priority: currentTask.priority,
              startDate: currentTask.startDate,
              deadline: currentTask.deadline,
              description: currentTask.description,
            }
            await tasksApi.updateTask({ todolistId, taskId, model })
            dispatch(setStatusAC({ status: "succeeded" }))
            return args
          } else {
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
          if (task) {
            task.title = action.payload.title
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
  },
})

export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
export const { deleteTaskTC, createTaskTC, fetchTasksTC, changeTaskStatusTC, changeTaskTitleTC } = tasksSlice.actions

export type TasksState = Record<string, DomainTask[]>
