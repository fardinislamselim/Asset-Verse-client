import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; 

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "assetverse-light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme(theme === "assetverse-light" ? "assetverse-dark" : "assetverse-light");
  };

  const isDark = theme === "assetverse-dark";

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      
      <input 
        type="checkbox" 
        onChange={handleToggle} 
        checked={isDark} 
        className="hidden" 
      />

      <FiMoon 
        className={`swap-off h-6 w-6 ${isDark ? "text-gray-400" : "text-gray-800"}`} 
      />

      <FiSun 
        className={`swap-on h-6 w-6 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} 
      />

    </label>
  );
}