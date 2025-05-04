import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"
import { createAppSlice } from "@/common/utils"
import { setStatusAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/types"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
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
          dispatch(setStatusAC({ status: "loading" }))
          const res = await todolistApi.getTodolists()
          dispatch(setStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
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
          dispatch(setStatusAC({ status: "loading" }))
          await todolistApi.changeTodolistTitle(args)
          dispatch(setStatusAC({ status: "succeeded" }))
          return args
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
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
          dispatch(setStatusAC({ status: "loading" }))
          dispatch(changeTodolistStatusAC({ id, entityStatus: "loading" }))
          await todolistApi.deleteTodolist(id)
          dispatch(setStatusAC({ status: "succeeded" }))
          return { id }
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
          dispatch(changeTodolistStatusAC({ id, entityStatus: "failed" }))
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
          dispatch(setStatusAC({ status: "loading" }))
          const res = await todolistApi.createTodolist(title)
          dispatch(setStatusAC({ status: "succeeded" }))
          return { todolist: res.data.data.item }
        } catch (error) {
          dispatch(setStatusAC({ status: "failed" }))
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
