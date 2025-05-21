import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types"
import { Nullable } from "@/features/todolists/api/tasksApi.types.ts"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as Nullable<string>,
    isLoggedIn: false,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    // Обновляет цветовую тему приложения
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode // логика мутабельного изменения стейта при изменении темы
    }),
    // Устанавливает статус загрузки приложения
    setStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status // логика мутабельного изменения стейта при изменении status(a) Loader загрузки
    }),
    // Устанавливает сообщение об ошибке приложения
    setAppErrorAC: create.reducer<{ error: Nullable<string> }>((state, action) => {
      state.error = action.payload.error // логика мутабельного изменения стейта при выведении сообщения об ошибке
    }),
    // Обновляет статус авторизации пользователя используется, при входе/выходе пользователя, чтобы сохранить статус авторизации.
    setIsLoggedInAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn // редюсер, который обновляет isLoggedIn в состоянии хранилища на основе переданного значения
    }),
  }),
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, setStatusAC: setAppStatusAC, setAppErrorAC, setIsLoggedInAC } = appSlice.actions
export const { selectThemeMode, selectStatus, selectError, selectIsLoggedIn } = appSlice.selectors

export type ThemeMode = "dark" | "light"
