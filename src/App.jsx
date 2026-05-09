import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router/index.jsx";
import "./index.css";

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark", theme === "light");
  };

  useEffect(() => {
    document.documentElement.classList.toggle(theme, theme === "dark");
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
