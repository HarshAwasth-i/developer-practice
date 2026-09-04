import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

function Navbar({ darkMode, setDarkMode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    function handleLogout() {
        logout();
        setMenuOpen(false);
        navigate("/login");
    }

    return (
        <header className="navbar-container">
            <nav className="navbar">
                {/* Logo */}
                <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    <div className="brand-icon">⚡</div>
                    <span className="brand-text">Task<span>Pulse</span></span>
                </Link>

                {/* Mobile Menu Trigger */}
                <button
                    className={`menu-btn ${menuOpen ? "active" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Navigation Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => (isActive ? "nav-item active-link" : "nav-item")}
                        end
                    >
                        Home
                    </NavLink>

                    {/* Authenticated Links */}
                    {token && (
                        <>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => (isActive ? "nav-item active-link" : "nav-item")}
                            >
                                <span className="nav-icon">📊</span> Dashboard
                            </NavLink>

                            <NavLink
                                to="/tasks"
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => (isActive ? "nav-item active-link" : "nav-item")}
                            >
                                <span className="nav-icon">📋</span> Tasks
                            </NavLink>

                            <NavLink
                                to="/projects"
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => (isActive ? "nav-item active-link" : "nav-item")}
                            >
                                <span className="nav-icon">📁</span> Projects
                            </NavLink>
                        </>
                    )}

                    {/* Controls and Auth Actions */}
                    <div className="nav-actions">
                        {/* Theme Toggle */}
                        <button
                            className="theme-btn"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? "☀️" : "🌙"}
                        </button>

                        {!token ? (
                            <div className="auth-buttons">
                                <Link
                                    to="/login"
                                    className="nav-btn-secondary"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="nav-btn-primary"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="user-section">
                                <ProfileDropdown />
                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                    title="Sign Out"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;