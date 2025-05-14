import { ThemeProvider } from "@mui/material/styles"
import { getTheme } from "@/common/theme"
import { CircularProgress, CssBaseline } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Header } from "@/common/components"
import { selectThemeMode } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "@/common/routing"
import { initializeAppTC } from "@/features/auth/model/auth-slice.ts"
import { useEffect, useState } from "react"
import styles from "./App.module.css"

export const App = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const theme = getTheme(themeMode)

  useEffect(() => {
    dispatch(initializeAppTC())
      // unwrap() - метод, преобразует не обычный Promise в стандартный Promise
      // Добавлен в RTK (начиная с версии 1.5.0)
      .unwrap()
      .finally(() => {
        setIsInitialized(true)
      })
  }, [])

  if (!isInitialized) {
    return (
      <div className={styles.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
