import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createSlice({
	name: "todolists",
	initialState: [] as DomainTodolist[],
	reducers: (create) => ({
		setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
			//return action.payload.todolists
			// 1 var
			action.payload.todolists.forEach((todolist) => {
				debugger
				state.push({ ...todolist, filter: "all" })
			})
			// 2 var
			// return action.payload.todolists.map((todolist) => {
			// 	return { ...todolist, filter: "all" }
			// })
		}),
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
})

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, createTodolistAC, setTodolistsAC } =
	todolistsSlice.actions

export type DomainTodolist = Todolist & {
	filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
