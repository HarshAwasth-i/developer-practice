import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

import ProjectCard from "../components/ProjectCard";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";

import "../styles/Projects.css";

const COLOR_PALETTE = [
    { label: "Indigo", value: "#6366f1" },
    { label: "Violet", value: "#8b5cf6" },
    { label: "Cyan", value: "#06b6d4" },
    { label: "Emerald", value: "#10b981" },
    { label: "Amber", value: "#f59e0b" },
    { label: "Rose", value: "#f43f5e" }
];

const CATEGORIES = [
    "General",
    "Development",
    "Design",
    "Product",
    "Marketing",
    "Personal"
];

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Planning",
        category: "Development",
        color: "#6366f1",
        dueDate: ""
    });

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await API.get("/projects");
            setProjects(res.data.projects || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenCreate = () => {
        setEditingProject(null);
        setFormData({
            name: "",
            description: "",
            status: "Planning",
            category: "Development",
            color: "#6366f1",
            dueDate: ""
        });
        setShowModal(true);
    };

    const handleOpenEdit = (project) => {
        setEditingProject(project);
        setFormData({
            name: project.name || "",
            description: project.description || "",
            status: project.status || "Planning",
            category: project.category || "General",
            color: project.color || "#6366f1",
            dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split("T")[0] : ""
        });
        setShowModal(true);
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Project name is required");
            return;
        }

        setSaving(true);
        try {
            if (editingProject) {
                const res = await API.put(`/projects/${editingProject._id}`, formData);
                setProjects(prev => prev.map(p => p._id === editingProject._id ? { ...p, ...res.data.project } : p));
                toast.success("Project updated successfully!");
            } else {
                const res = await API.post("/projects", formData);
                setProjects(prev => [res.data.project, ...prev]);
                toast.success("Project created successfully!");
            }
            setShowModal(false);
            fetchProjects(); // Refresh to re-calculate stats
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save project");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/projects/${deleteId}`);
            setProjects(prev => prev.filter(p => p._id !== deleteId));
            toast.success("Project deleted");
            setDeleteId(null);
        } catch (err) {
            toast.error("Failed to delete project");
        }
    };

    // Filter projects
    const filteredProjects = projects.filter((p) => {
        const matchesSearch = !search ||
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Summary calculations
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "In Progress" || p.status === "Planning").length;
    const completedProjects = projects.filter(p => p.status === "Completed").length;
    const avgProgress = totalProjects > 0
        ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects)
        : 0;

    return (
        <div className="projects-page">
            {/* Header */}
            <div className="projects-header">
                <div className="projects-title-group">
                    <h1>Projects & Workspaces</h1>
                    <p>Group tasks into milestones, set target deadlines, and track comprehensive project velocity.</p>
                </div>
                <button className="create-project-primary-btn" onClick={handleOpenCreate}>
                    ⚡ + New Project
                </button>
            </div>

            {/* Top Summary Metrics */}
            <div className="projects-metric-cards">
                <div className="proj-metric-box">
                    <span className="metric-box-title">Total Projects</span>
                    <strong className="metric-box-num">{totalProjects}</strong>
                </div>
                <div className="proj-metric-box">
                    <span className="metric-box-title">Active Workspaces</span>
                    <strong className="metric-box-num in-prog">{activeProjects}</strong>
                </div>
                <div className="proj-metric-box">
                    <span className="metric-box-title">Completed Projects</span>
                    <strong className="metric-box-num done">{completedProjects}</strong>
                </div>
                <div className="proj-metric-box">
                    <span className="metric-box-title">Average Progress</span>
                    <strong className="metric-box-num">{avgProgress}%</strong>
                </div>
            </div>

            {/* Toolbar */}
            <div className="projects-toolbar">
                <div className="search-bar-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {search && (
                        <button className="clear-search-btn" onClick={() => setSearch("")}>✕</button>
                    )}
                </div>

                <div className="projects-filters">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <Loader />
            ) : filteredProjects.length === 0 ? (
                <div className="projects-empty-card">
                    <div className="empty-icon">📁</div>
                    <h3>No projects found</h3>
                    <p>Create a project workspace to start organizing your tasks together.</p>
                    <button className="create-project-primary-btn" onClick={handleOpenCreate}>
                        + Create First Project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={handleOpenEdit}
                            onDelete={(id) => setDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            {/* Create / Edit Project Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="project-modal animate-fade" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProject ? "Edit Project" : "Create New Project"}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSaveProject} className="project-form-body">
                            <div className="form-group">
                                <label>Project Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website Redesign, Mobile App v2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Describe the scope, objectives, and deliverables..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row-grid">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Planning">Planning</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row-grid">
                                <div className="form-group">
                                    <label>Target Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Theme Color</label>
                                    <div className="color-presets-row">
                                        {COLOR_PALETTE.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                className={`color-dot-btn ${formData.color === c.value ? "selected" : ""}`}
                                                style={{ backgroundColor: c.value }}
                                                onClick={() => setFormData({ ...formData, color: c.value })}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="save-task-btn"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : editingProject ? "Save Changes" : "+ Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Project"
                    message="Are you sure you want to delete this project? Associated tasks will remain in your general task pool."
                    onConfirm={handleDeleteProject}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default Projects;