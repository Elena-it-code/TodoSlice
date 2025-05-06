import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode // логика мутабельного изменения стейта при изменении темы
    }),
    setStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status // логика мутабельного изменения стейта при изменении status(a) Loader загрузки
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error // логика мутабельного изменения стейта при выведении сообщения об ошибке
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, setStatusAC: setAppStatusAC, setAppErrorAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError } = appSlice.selectors

export type ThemeMode = "dark" | "light"
