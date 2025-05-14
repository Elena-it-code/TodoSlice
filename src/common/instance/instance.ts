import axios from "axios"
import { AUTH_TOKEN } from "@/common/constants"

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "API-KEY": import.meta.env.VITE_API_KEY,
  },
})

// Добавляем перехват запросов
instance.interceptors.request.use(function (config) {
  // Здесь можете сделать что-нибудь с перед отправкой запроса
  const token = localStorage.getItem(AUTH_TOKEN)
  config.headers.Authorization = `Bearer ${token}`
  return config
})
