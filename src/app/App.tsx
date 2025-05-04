import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import { getTheme } from "@/common/theme"
import { Main } from "@/app/Main.tsx"
import { CssBaseline } from "@mui/material"
import { useAppSelector } from "@/common/hooks"
import { Header } from "@/common/components"
import { selectThemeMode } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar.tsx"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Main />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
