import Toolbar from "@mui/material/Toolbar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Switch from "@mui/material/Switch"
import AppBar from "@mui/material/AppBar"
import { getTheme } from "@/common/theme"
import { changeThemeModeAC, selectIsLoggedIn, selectStatus, selectThemeMode, setIsLoggedInAC } from "@/app/app-slice.ts"
import { containerSx } from "@/common/styles"
import { NavButton } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import LinearProgress from "@mui/material/LinearProgress"
import { useLogoutMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { baseApi } from "@/app/baseApi.ts"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const theme = getTheme(themeMode)

  const [logout] = useLogoutMutation()

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }
  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN) // удалем token
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
        }
      })
      .then(() => {
        //dispatch(baseApi.util.resetApiState()) // зачищаем полностью весь стейт
        dispatch(baseApi.util.invalidateTags(["Task", "Todolist"])) // зачищаем именено Task(и) и Todolist(ы)
      })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Sign out</NavButton>}
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
