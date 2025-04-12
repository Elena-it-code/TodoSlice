import { RootState } from "../../../app/store.ts"
import { Todolist } from "@/features/todolists/model/todolists-reducer.ts"

export const selectTodolists = (state: RootState): Todolist[] => state.todolists
