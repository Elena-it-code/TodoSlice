import { z } from "zod"

export type Todolist = z.infer<typeof TodolistSchema>

export const TodolistSchema = z.object({
  addedDate: z.string(),
  id: z.string(),
  order: z.number(),
  title: z.string(),
})
