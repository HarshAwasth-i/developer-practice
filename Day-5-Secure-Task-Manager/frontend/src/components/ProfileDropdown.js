import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "../styles/ProfileDropdown.css";

function ProfileDropdown() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        progress: 0
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/tasks");
                const tasks = res.data.tasks || [];
                const total = tasks.length;
                const completed = tasks.filter(t => t.status === "Completed" || t.completed).length;
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

                setStats({ total, completed, progress });
            } catch (err) {
                console.error("Profile stats error:", err);
            }
        };

        if (open) {
            fetchStats();
        }
    }, [open]);

    // Initial avatar letter
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="profile-container" ref={dropdownRef}>
            <button
                className="profile-button"
                onClick={() => setOpen(!open)}
                title="View Profile Stats"
            >
                <div className="user-avatar-pill">
                    {initial}
                </div>
                <span className="user-nav-name">{user?.name?.split(" ")[0] || "Account"}</span>
            </button>

            {open && (
                <div className="profile-card animate-fade">
                    <div className="profile-header-top">
                        <div className="profile-avatar-lg">{initial}</div>
                        <div className="profile-name-email">
                            <h4>{user?.name || "Productivity User"}</h4>
                            <p>{user?.email || "user@taskpulse.io"}</p>
                        </div>
                    </div>

                    <div className="profile-stats-box">
                        <div className="prof-stat">
                            <span>Tasks</span>
                            <strong>{stats.total}</strong>
                        </div>
                        <div className="prof-stat">
                            <span>Done</span>
                            <strong className="done-text">{stats.completed}</strong>
                        </div>
                        <div className="prof-stat">
                            <span>Score</span>
                            <strong className="score-text">{stats.progress}%</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;