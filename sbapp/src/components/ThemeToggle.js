import React from "react";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";


function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="tt-btn"
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      <span className="tt-track">
        <span className="tt-thumb">
          {theme === "dark" ? "☽" : "☀"}
        </span>
      </span>
      <span className="tt-label">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;