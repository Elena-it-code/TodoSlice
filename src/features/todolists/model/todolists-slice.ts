import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"

export const todolistsSlice = createSlice({
	name: "todolists",
	initialState: [] as DomainTodolist[],
	reducers: (create) => ({
		deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
			const index = state.findIndex((todolist) => todolist.id === action.payload.id)
			if (index !== -1) {
				state.splice(index, 1)
			}
		}),
		changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
			const index = state.findIndex((todolist) => todolist.id === action.payload.id)
			if (index !== -1) {
				state[index].filter = action.payload.filter
			}
		}),
		createTodolistAC: create.preparedReducer(
			(title: string) => {
				return {
					payload: {
						title,
						id: nanoid(),
					},
				}
			},
			(state, action) => {
				const newTodolist: DomainTodolist = {
					title: action.payload.title,
					filter: "all",
					id: action.payload.id,
					order: 0,
					addedDate: "",
				}
				state.push(newTodolist)
			},
		),
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
	},
})

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions

export type DomainTodolist = Todolist & {
	filter: FilterValues
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

export type FilterValues = "all" | "active" | "completed"
