import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Recommendations", path: "/recommendations" },
    { label: "My Ratings", path: "/myratings" },
    { label: "Analytics", path: "/analytics" },
    { label: "Logout", path: "/login" },
  ];

  const [activeNav, setActiveNav] = useState(location.pathname);

  const handleNavClick = (path) => {
    setActiveNav(path);

    if (path === "/login") {
      // Handle logout logic here
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <Film className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              MovieMind
            </span>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="relative group"
              >
                <span
                  className={`transition-colors ${
                    activeNav === item.path
                      ? "text-cyan-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
                {activeNav === item.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
