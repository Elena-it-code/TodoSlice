import {changeTodolistFilterAC, FilterValues, Todolist} from "@/features/todolists/model/todolists-reducer.ts";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import {containerSx} from "@/common/styles";
import {useAppDispatch} from "@/common/hooks";

type Props = {
    todolist: Todolist
}

export const FilterButtons = ({todolist}: Props) => {
    const {id, filter} = todolist

    const dispatch = useAppDispatch()

    const changeFilter = (filter: FilterValues) => {
        dispatch(changeTodolistFilterAC({id, filter}))
    }

    return (
        <Box sx={containerSx}>
            <Button variant={filter === 'all' ? 'outlined' : 'text'}
                    color={'inherit'}
                    onClick={() => changeFilter('all')}>
                All
            </Button>
            <Button variant={filter === 'active' ? 'outlined' : 'text'}
                    color={'primary'}
                    onClick={() => changeFilter('active')}>
                Active
            </Button>
            <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                    color={'secondary'}
                    onClick={() => changeFilter('completed')}>
                Completed
            </Button>
        </Box>
    )
}