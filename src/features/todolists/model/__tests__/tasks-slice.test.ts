import { beforeEach, expect, test } from "vitest"

import { createTaskTC, deleteTaskTC, tasksReducer, TasksState, updateTaskTC } from "../tasks-slice.ts"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"

let startState: TasksState = {}
const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0,
}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  }
})

test("correct task should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled(
      {
        todolistId: "todolistId2",
        taskId: "2",
      }, // payload (что возвращает API)
      "requestId", // requestId (можно любое уникальное значение)
      { todolistId: "todolistId2", taskId: "2" }, // arg (то, что передали в санку)
    ),
  )

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues,
      },
    ],
  })
})

test("correct task should be created at correct array", () => {
  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(
      { task: { id: "5", title: "juice", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues } }, // payload (что возвращает API)
      "requestId", // requestId (можно любое уникальное значение)
      { todolistId: "todolistId2", title: "juice" }, // arg (то, что передали в санку)
    ),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {
  const task = {
    id: "2",
    title: "milk",
    status: TaskStatus.New,
    description: "",
    deadline: "",
    addedDate: "",
    startDate: "",
    priority: TaskPriority.Low,
    order: 0,
    todoListId: "todolistId2",
  }
  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { status: TaskStatus.New },
    }),
  )

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

test("correct task should change its title", () => {
  const task = {
    id: "2",
    title: "coffee",
    status: TaskStatus.Completed,
    description: "",
    deadline: "",
    addedDate: "",
    startDate: "",
    priority: TaskPriority.Low,
    order: 0,
    todoListId: "todolistId2",
  }
  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task }, "requestId", {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { title: "coffee" },
    }),
  )

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const endState = tasksReducer(
    startState,
    createTodolistTC.fulfilled(
      {
        todolist: {
          addedDate: " ",
          id: "7",
          order: 8,
          title: "New todolist",
        }, // payload (что возвращает API)
      },
      "requestId", // requestId (В тестах можно передать любую строку, это техническое поле, которое генерирует Redux Toolkit для отслеживания запросов)
      "New todolist", // arg (то, что передали в санку). В данном случае string
    ),
  )

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled({ id: "todolistId2" }, "requestId", "todolistId2"),
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
