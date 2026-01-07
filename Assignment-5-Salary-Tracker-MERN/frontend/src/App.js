import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SalaryTracker from "./components/SalaryTracker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<SalaryTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
