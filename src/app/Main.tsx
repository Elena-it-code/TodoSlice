import Grid from "@mui/material/Grid2"
import { CreateItemForm } from "@/common/components"
import Container from "@mui/material/Container"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists.tsx"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistApi.ts"

export const Main = () => {
  const [createTodolist] = useAddTodolistMutation()

  const createTodolistHandler = (title: string) => {
    createTodolist(title)
  }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
