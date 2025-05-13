import styles from "./PageNotFound.module.css"
import Button from "@mui/material/Button"
import { Link } from "react-router"
import Container from "@mui/material/Container"
import { Path } from "@/common/routing"

export const PageNotFound = () => (
  <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button variant="contained" component={Link} to={Path.Main} sx={{ width: "330px", mt: "20px", marginTop: "50px" }}>
      на главную страницу
    </Button>
  </Container>
)
