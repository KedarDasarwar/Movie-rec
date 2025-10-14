import React from "react";
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MyRatings from "./pages/MyRatings";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import Login from "./components/login";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/myratings" element={<MyRatings />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
