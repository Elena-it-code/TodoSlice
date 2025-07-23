import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "@/app/app-slice.ts"
import { todolistApi } from "@/features/todolists/api/todolistApi.ts"
import { setupListeners } from "@reduxjs/toolkit/query"

// создание store
export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [todolistApi.reducerPath]: todolistApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todolistApi.middleware),
})
// необязательно, но необходимо для refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)
// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
