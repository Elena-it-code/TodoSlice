import './App.css'
import {ThemeProvider} from '@mui/material/styles'
import {Header} from "@/common/components/Header/Header.tsx";
import {getTheme} from "@/common/theme/theme.ts";
import {selectThemeMode} from "@/app/app-selectors.ts";
import {Main} from "@/app/Main.tsx";
import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {CssBaseline} from "@mui/material";


export const App = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)

    return (
        <ThemeProvider theme={theme}>
            <div className={'app'}>
                <CssBaseline/>
                <Header/>
                <Main/>
            </div>
        </ThemeProvider>
    )
}
