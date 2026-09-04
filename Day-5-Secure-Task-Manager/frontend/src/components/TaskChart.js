import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import "../styles/TaskChart.css";

const STATUS_COLORS = {
    "Completed": "#10b981",
    "In Progress": "#2563eb",
    "Todo": "#64748b"
};

const PRIORITY_COLORS = {
    "High": "#f43f5e",
    "Medium": "#f59e0b",
    "Low": "#10b981"
};

function TaskChart({ tasks = [] }) {
    // Status counts
    const completed = tasks.filter(t => t.status === "Completed" || t.completed).length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const todo = tasks.filter(t => t.status === "Todo" || (!t.status && !t.completed)).length;

    const statusData = [
        { name: "Completed", value: completed },
        { name: "In Progress", value: inProgress },
        { name: "Todo", value: todo }
    ].filter(item => item.value > 0);

    // Priority counts
    const high = tasks.filter(t => t.priority === "High").length;
    const medium = tasks.filter(t => t.priority === "Medium" || !t.priority).length;
    const low = tasks.filter(t => t.priority === "Low").length;

    const priorityData = [
        { name: "High", value: high },
        { name: "Medium", value: medium },
        { name: "Low", value: low }
    ].filter(item => item.value > 0);

    if (tasks.length === 0) {
        return (
            <div className="chart-card empty-chart-card">
                <h3>📊 Task Distribution</h3>
                <p className="no-data-msg">Create some tasks to view live productivity charts!</p>
            </div>
        );
    }

    return (
        <div className="analytics-charts-container">
            {/* Status Breakdown Chart */}
            <div className="chart-card">
                <div className="chart-card-header">
                    <h3>⚡ Status Distribution</h3>
                    <span className="chart-sub">Total: {tasks.length}</span>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={STATUS_COLORS[entry.name] || "#2563eb"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--bg-surface-elevated)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)"
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Priority Breakdown Chart */}
            <div className="chart-card">
                <div className="chart-card-header">
                    <h3>🎯 Priority Breakdown</h3>
                    <span className="chart-sub">Urgency</span>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={priorityData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={PRIORITY_COLORS[entry.name] || "#f59e0b"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--bg-surface-elevated)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)"
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default TaskChart;