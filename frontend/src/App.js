import "./App.css";
import "./components/Navbar/Navbar.js";
import Navbar from "./components/Navbar/Navbar.js";
import { Access } from "./pages/Auth/Access";
import { Login } from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { Dashboard } from "./pages/Dashboard/Dashboard.js";
import { Maintenance } from "./pages/Maintenance/Maintenance.js";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                  </>
                }
              ></Route>
              <Route
                path="/access"
                element={
                  <>
                    <Access />
                  </>
                }
              ></Route>
              <Route
                path="/login"
                element={
                  <>
                    <Login />
                  </>
                }
              ></Route>
              <Route
                path="/signup"
                element={
                  <>
                    <Signup />
                  </>
                }
              ></Route>
              <Route
                path="/dashboard"
                element={
                  <>
                    <Dashboard />
                  </>
                }
              ></Route>
            </Routes>
          </Router>
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
