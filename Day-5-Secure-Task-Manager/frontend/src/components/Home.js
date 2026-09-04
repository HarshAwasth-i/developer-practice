import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
    const { token } = useAuth();

    return (
        <div className="home-page-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-fade">
                    <div className="hero-pill-badge">
                        <span className="pill-dot"></span>
                        ⚡ Next-Gen Task & Kanban Workspace
                    </div>

                    <h1 className="hero-title">
                        Manage tasks with ease.<br />
                        <span>Accelerate your pulse.</span>
                    </h1>

                    <p className="hero-subtitle">
                        TaskPulse brings full-stack Kanban boards, project workspaces, subtask checklists, and real-time productivity analytics into one unified, lightning-fast workspace.
                    </p>

                    <div className="hero-cta-group">
                        {token ? (
                            <Link to="/dashboard" className="cta-primary-btn">
                                Open Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="cta-primary-btn">
                                    Get Started Free →
                                </Link>
                                <Link to="/login" className="cta-secondary-btn">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hero-trust-row">
                        <div className="trust-item">
                            <strong>100%</strong>
                            <span>Free & Open Source</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <strong>MERN</strong>
                            <span>Modern Stack</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <strong>Kanban</strong>
                            <span>Drag & Drop Ready</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual Live Card */}
                <div className="hero-visual-wrap animate-fade">
                    <div className="interactive-preview-card">
                        <div className="preview-top-bar">
                            <div className="preview-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="preview-title">TaskPulse Workspace</span>
                            <span className="preview-badge">Live Preview</span>
                        </div>

                        {/* Mini Kanban Columns Preview */}
                        <div className="preview-board">
                            <div className="preview-column">
                                <div className="prev-col-header">
                                    <span className="prev-dot dot-todo"></span>
                                    <span>Todo (2)</span>
                                </div>
                                <div className="prev-card">
                                    <span className="prev-tag tag-dev">#Frontend</span>
                                    <h4>Design System v2</h4>
                                    <div className="prev-progress">
                                        <div className="prev-progress-bar" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                                <div className="prev-card">
                                    <span className="prev-tag tag-urgent">High</span>
                                    <h4>API Performance</h4>
                                </div>
                            </div>

                            <div className="preview-column">
                                <div className="prev-col-header">
                                    <span className="prev-dot dot-prog"></span>
                                    <span>In Progress (1)</span>
                                </div>
                                <div className="prev-card active-prev-card">
                                    <span className="prev-tag tag-design">#Kanban</span>
                                    <h4>Interactive Drag & Drop</h4>
                                    <span className="due-soon-pill">⏰ Due Today</span>
                                </div>
                            </div>

                            <div className="preview-column">
                                <div className="prev-col-header">
                                    <span className="prev-dot dot-done"></span>
                                    <span>Completed (3)</span>
                                </div>
                                <div className="prev-card done-card">
                                    <h4>JWT Authentication</h4>
                                    <span className="check-done-pill">✓ Done</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header-centered">
                    <span className="section-tag">Powerful Capabilities</span>
                    <h2>Everything you need to deliver on time</h2>
                    <p>Designed for engineers, designers, and teams who value speed, clarity, and beautiful aesthetics.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-box icon-indigo">📋</div>
                        <h3>Interactive Kanban Boards</h3>
                        <p>Drag, drop, reorder, and update task statuses across Todo, In Progress, and Completed columns in real time.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box icon-purple">📁</div>
                        <h3>Project Workspaces</h3>
                        <p>Group tasks into dedicated projects with custom color branding, category tags, and completion progress bars.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box icon-cyan">📊</div>
                        <h3>Productivity Analytics</h3>
                        <p>Visualize task completion rates, priority distribution, and upcoming deadlines with rich interactive charts.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box icon-emerald">✅</div>
                        <h3>Subtask Checklists</h3>
                        <p>Break complex deliverables down into bite-sized actionable checklist items with real-time percentage tracking.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box icon-amber">⏰</div>
                        <h3>Deadline & Overdue Alerts</h3>
                        <p>Stay ahead of critical dates with dynamic deadline badges, today alerts, and prominent overdue task warnings.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-box icon-rose">⚡</div>
                        <h3>Activity Stream & Audit</h3>
                        <p>Keep track of all actions, from creation to status shifts and subtask updates, logged with precise relative time.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;