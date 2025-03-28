import {RootState} from "../app/store.ts";
import {Todolist} from "../app/App.tsx";

export const selectTodolists = (state: RootState): Todolist[] => state.todolists