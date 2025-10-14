import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Recommendations", path: "/recommendations" },
  { name: "My Ratings", path: "/myratings" },
  { name: "Analytics", path: "/analytics" },
  { name: "Login", path: "/login" },
];

const Navbar = () => {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              MovieMind
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActiveNav(item.path)}
                className={`relative group transition-colors ${
                  activeNav === item.path
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
                {activeNav === item.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
