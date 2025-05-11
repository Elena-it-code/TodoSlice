import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import { getTheme } from "@/common/theme"
import { CssBaseline } from "@mui/material"
import { useAppSelector } from "@/common/hooks"
import { Header } from "@/common/components"
import { selectThemeMode } from "@/app/app-slice.ts"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar.tsx"
import { Routing } from "@/common/routing"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
