import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleDemoFill = () => {
        setForm({
            email: "demo@taskpulse.io",
            password: "password123"
        });
        toast("Demo credentials loaded! Click Sign In or Register.", { icon: "💡" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.email || !form.password) {
            toast.error("Please provide both email and password");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/auth/login", form);
            login(res.data.token, res.data.user);
            toast.success(`Welcome back, ${res.data.user?.name || "User"}!`);
            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade">
                <div className="auth-header">
                    <div className="auth-icon">⚡</div>
                    <h2>Welcome back</h2>
                    <p>Enter your credentials to access your workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrap">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In to TaskPulse →"}
                    </button>

                    <button
                        type="button"
                        className="demo-fill-btn"
                        onClick={handleDemoFill}
                    >
                        ⚡ Fill Demo Credentials
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;