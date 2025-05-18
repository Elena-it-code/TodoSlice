import { Todolist, TodolistSchema } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums/enums.ts"
import { clearDataAC } from "@/common/actions"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(clearDataAC, () => {
      return []
    })
  },
  reducers: (create) => ({
    // 🔵 actions
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    }),
    // 🟢 async actions (thunk)
    fetchTodolistsTC: create.asyncThunk(
      async (_arg, { rejectWithValue, dispatch }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistApi.getTodolists()
          const todolists = TodolistSchema.array().parse(res.data) // 💎 ZOD
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((todolist) => {
            state.push({ ...todolist, filter: "all", entityStatus: "idle" })
          })
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (args: { id: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistApi.changeTodolistTitle(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return args
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
          const todolist = state.find((todolist) => todolist.id === action.payload.id)
          if (todolist) {
            todolist.title = action.payload.title
          }
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({ id, entityStatus: "loading" }))
          const res = await todolistApi.deleteTodolist(id)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { id }
          } else {
            dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistApi.createTodolist(title)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { todolist: res.data.data.item }
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
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
      },
    ),
  }),
})

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
export const {
  changeTodolistFilterAC,
  fetchTodolistsTC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  createTodolistTC,
  changeTodolistStatusAC,
} = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter?: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
