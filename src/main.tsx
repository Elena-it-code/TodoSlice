import { createRoot } from "react-dom/client"
import "./index.css"
import { store } from "./app/store.ts"
import { Provider } from "react-redux"
import { App } from "@/app/App.tsx"
import { BrowserRouter } from "react-router"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
