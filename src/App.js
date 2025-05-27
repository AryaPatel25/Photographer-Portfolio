import React, { useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signuppage";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage/HomePage";
import Portfolio from "./components/Portfolio/Portfolio";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import BlogPage from "./components/Blog/BlogPage";
import BlogPostDetail from "./components/Blog/BlogPostDetail";
import AdminBlogManagement from "./components/Blog/AdminBlogManagement.js";

import ProtectedRoute from "./components/Firebase/ProtectedRoute";
import { AuthContext } from "./components/Firebase/AuthContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const { currentUser, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e0e10",
          color: "#fff",
          fontSize: "1.5rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/forget-password" element={<ForgetPassword />} />

            {/* Redirect logged-in users away from login/signup */}
            <Route
              path="/login"
              element={
                currentUser ? <Navigate to="/home" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                currentUser ? <Navigate to="/home" replace /> : <Signup />
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <HomePage setActiveTab={setActiveTab} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <BlogPage isAdmin={isAdmin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:postId"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser}>
                  <BlogPostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog-management"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser && isAdmin}>
                  <AdminBlogManagement />
                </ProtectedRoute>
              }
            />
            {/* Admin dashboard restricted */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute isAuthenticated={!!currentUser && isAdmin}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
