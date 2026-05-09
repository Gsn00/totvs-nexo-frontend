import { RouterProvider } from "react-router";
import { router } from "./router/index.jsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
