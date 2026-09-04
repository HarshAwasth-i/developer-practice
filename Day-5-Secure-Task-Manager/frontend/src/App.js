import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import ProjectDetails from "./pages/ProjectDetails";

import { AuthProvider } from "./context/AuthContext";

function NotFound() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
            textAlign: "center",
            padding: "40px"
        }}>
            <h1 style={{ fontSize: "5rem", fontWeight: "800", color: "var(--primary)", marginBottom: "12px" }}>404</h1>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "16px" }}>Page Not Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px", maxWidth: "400px" }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" style={{
                background: "var(--primary)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: "600",
                boxShadow: "0 4px 14px var(--primary-glow)"
            }}>
                Back to Safety →
            </Link>
        </div>
    );
}

function App() {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark" || 
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className={darkMode ? "app dark" : "app light"}>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3500,
                            style: {
                                background: darkMode ? "#1e293b" : "#ffffff",
                                color: darkMode ? "#f8fafc" : "#0f172a",
                                border: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                padding: "12px 18px",
                            },
                        }}
                    />

                    <Navbar
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                    />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/tasks"
                            element={
                                <ProtectedRoute>
                                    <Tasks />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute>
                                    <Projects />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/projects/:id"
                            element={
                                <ProtectedRoute>
                                    <ProjectDetails />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;