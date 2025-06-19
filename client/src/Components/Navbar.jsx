import React, { useEffect, useState } from "react";
import { FaSun, FaMoon, FaGraduationCap } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const element = document.querySelector("html");
    element.classList.remove("dark", "light");
    if (darkMode) {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/blog", label: "Our Blogs" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaGraduationCap className="text-3xl text-orange-500" />
            <span className="text-xl font-bold text-white">LearnSmart</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-orange-500 font-semibold"
                    : "text-gray-300 hover:text-orange-500"
                } transition-colors duration-200 text-sm font-medium`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-orange-500/10 transition-colors duration-200"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <FaSun className="text-xl text-orange-500" />
            ) : (
              <FaMoon className="text-xl text-orange-500" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                isActive(item.path)
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-orange-500/10"
              } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
