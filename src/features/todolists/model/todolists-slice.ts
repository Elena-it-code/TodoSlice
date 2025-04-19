import { createAction, createSlice, nanoid } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
	name: "todolists",
	initialState: [] as Todolist[],
	reducers: (create) => ({
		deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
			const index = state.findIndex((todolist) => todolist.id === action.payload.id)
			if (index !== -1) {
				state.splice(index, 1)
			}
		}),
		changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
			const todolist = state.find((todolist) => todolist.id === action.payload.id)
			if (todolist) {
				todolist.title = action.payload.title
			}
		}),
		changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
			const index = state.findIndex((todolist) => todolist.id === action.payload.id)
			if (index !== -1) {
				state[index].filter = action.payload.filter
			}
		}),
		// 1 variant
		// createTodolistAC: create.reducer<string>((state, action) => {
		// 	const newTodolist: Todolist = {
		// 		title: action.payload,
		// 		filter: "all",
		// 		id: nanoid(),
		// 	}
		// 	state.push(newTodolist)
		// }),
		// 2 variant
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
				const newTodolist: Todolist = {
					title: action.payload.title,
					filter: "all",
					id: action.payload.id,
				}
				state.push(newTodolist)
			},
		),
	}),
})

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC } =
	todolistsSlice.actions

export const _createTodolistAC = createAction("todolists/createTodolist", (title: string) => {
	return { payload: { title, id: nanoid() } }
})

export type Todolist = {
	id: string
	title: string
	filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

// export const _todolistsReducer = createReducer([], (builder) => {
//   builder.addCase(createTodolistAC, (state, action) => {
//     state.push({ ...action.payload, filter: "all" })
//   })
// })
