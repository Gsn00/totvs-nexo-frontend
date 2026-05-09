import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router/index.jsx";
import "./index.css";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark", theme === "light");
  };

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
