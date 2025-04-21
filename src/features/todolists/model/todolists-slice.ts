import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(setTodolists.fulfilled, (state, action) => {
        action.payload?.todolists.forEach((todolist) => {
          state.push({ ...todolist, filter: "all" })
        })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.title = action.payload.title
        }
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all" })
      })
  },
})

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
export const { changeTodolistFilterAC } = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter?: FilterValues
}

export const setTodolists = createAsyncThunk(`${todolistsSlice.name}/setTodolists`, async (_, { rejectWithValue }) => {
  try {
    const res = await todolistApi.getTodolists()
    return { todolists: res.data }
    // thunkAPI.dispatch(setTodolistsAC({ todolists: res.data }))
  } catch (error) {
    return rejectWithValue(null)
  }
})

export const changeTodolistTitle = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitle`,
  async (args: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (id: string, thunkAPI) => {
    try {
      await todolistApi.deleteTodolist(id)
      return { id }
    } catch (error) {
      return thunkAPI.rejectWithValue(null)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    try {
      const res = await todolistApi.createTodolist(title)
      return { todolist: res.data.data.item }
    } catch (error) {
      return thunkAPI.rejectWithValue(null)
    }
  },
)

export type FilterValues = "all" | "active" | "completed"
