import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Login } from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import { Dashboard } from "./pages/Dashboard/Dashboard.jsx";
import { Maintenance } from "./pages/Maintenance/Maintenance.jsx";
import Home from "./pages/Home/Home.jsx";
import Recommendations from "./pages/Recommendations/Recommendations.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                <Route
                  path="/recommendations"
                  element={
                    <>
                      <Recommendations />
                    </>
                  }
                ></Route>
              </Routes>
            </Router>
          </AuthProvider>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
