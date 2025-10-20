import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import MyRatings from "./pages/MyRatings";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import Login from "./components/login";
import Navbar from "./components/navbar";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/myratings" element={<MyRatings />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

// ✅ Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
