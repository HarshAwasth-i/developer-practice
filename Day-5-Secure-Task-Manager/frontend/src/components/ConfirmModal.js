import "../styles/ConfirmModal.css";

function ConfirmModal({
    show = true,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Delete",
    onConfirm,
    onCancel
}) {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="confirm-modal animate-fade" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-icon">⚠️</div>
                <h3>{title}</h3>
                <p>{message}</p>

                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-delete-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;