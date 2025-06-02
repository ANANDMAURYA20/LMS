import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import logo from '../assets/images/name.png'
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const element = document.querySelector("html");
    element.classList.remove("dark", "dark");
    if (darkMode) {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [darkMode]);

  return (
    
      
<nav className="sticky top-0 z-50 md:h-[72px] h-[65px] md:px-[35px] px-[15px] bg-[#ffffffd0] dark:bg-[#21242bc5] shadow-custom backdrop-blur-md flex justify-between">
  <h1 className="text-lg font-bold text-gray-900 dark:text-white self-center pl-10 mb-2"></h1>
  <Link to={"/"}>
  </Link>
  {/* <button className="p-5 rounded-full text-lg font-semibold">
    {darkMode ? (
      <FaSun size={26} className="text-white" onClick={toggleDarkMode} />
    ) : (
      <FaMoon
        size={26}
        className="text-gray-900"
        onClick={toggleDarkMode}
      />                                        
    )}
  </button> */}
</nav>
  );
}
