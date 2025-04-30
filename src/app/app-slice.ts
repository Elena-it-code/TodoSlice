import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode // логика мутабельного изменения стейта при изменении темы
    }),
    setStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status // логика мутабельного изменения стейта при изменении status(a) Loader загрузки
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, setStatusAC } = appSlice.actions
export const { selectThemeMode, selectStatus } = appSlice.selectors

export type ThemeMode = "dark" | "light"
