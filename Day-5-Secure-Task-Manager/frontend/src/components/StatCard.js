import "../styles/StatCard.css";

function StatCard({ title, value, icon, subtitle, colorVariant = "primary", onClick }) {
    return (
        <div
            className={`stat-card-modern variant-${colorVariant} ${onClick ? "clickable" : ""}`}
            onClick={onClick}
        >
            <div className="stat-card-inner">
                <div className="stat-text-side">
                    <span className="stat-title-label">{title}</span>
                    <h3 className="stat-value-num">{value}</h3>
                    {subtitle && <span className="stat-subtitle">{subtitle}</span>}
                </div>
                {icon && (
                    <div className="stat-icon-badge">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatCard;