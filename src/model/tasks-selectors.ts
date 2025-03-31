import {TasksState} from "@/app/App.tsx";
import {RootState} from "@/app/store.ts";


export const selectTasks = (state: RootState): TasksState => state.tasks