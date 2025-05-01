import { beforeEach, expect, test } from "vitest"
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  DomainTodolist,
  todolistsReducer,
} from "../todolists-slice.ts"
import { nanoid } from "@reduxjs/toolkit"

let todolistId1: string
let todolistId2: string
let startState: DomainTodolist[] = []

beforeEach(() => {
  todolistId1 = nanoid()
  todolistId2 = nanoid()

  startState = [
    { id: todolistId1, title: "What to learn", addedDate: "", order: 0, filter: "all" },
    { id: todolistId2, title: "What to buy", addedDate: "", order: 0, filter: "all" },
  ]
})
test("correct todolist should be deleted", () => {
  const endState = todolistsReducer(
    startState,
    deleteTodolistTC.fulfilled(
      { id: todolistId1 }, // payload (то, что возвращает API)
      "requestId", // requestId (В тестах можно передать любую строку, это техническое поле, которое генерирует Redux Toolkit для отслеживания запросов)
      todolistId1, // arg (id тудулиста)
    ),
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be created", () => {
  const title = "New todolist"
  // Имитируем успешный ответ санки
  const mockTodolist = {
    id: "new-id",
    title,
    addedDate: "",
    order: 0,
    filter: "all" as const,
  }
  const endState = todolistsReducer(
    startState,
    createTodolistTC.fulfilled(
      { todolist: mockTodolist }, // payload (то, что возвращает API)
      "requestId", // requestId (можно любое уникальное значение)
      title, // arg (то, что передали в санку)
    ),
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(title) // unshift добавляет в начало
})

test("correct todolist should change its title", () => {
  const title = "New title"
  const endState = todolistsReducer(
    startState,
    changeTodolistTitleTC.fulfilled(
      { id: todolistId2, title }, // payload (что возвращает API)
      "requestId", // requestId
      { id: todolistId1, title }, // arg (  {id тудулиста и title}  )
    ),
  )

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(title)
})

test("correct todolist should change its filter", () => {
  const filter = "completed"
  const endState = todolistsReducer(startState, changeTodolistFilterAC({ id: todolistId2, filter }))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(filter)
})
