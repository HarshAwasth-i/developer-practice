import "../styles/ConfirmModal.css";


function ConfirmModal({
    show,
    onConfirm,
    onCancel
}){


    if(!show)
        return null;


    return(

        <div className="modal-overlay">


            <div className="confirm-modal">


                <h2>
                    Delete Task?
                </h2>


                <p>
                    Are you sure you want to delete this task?
                </p>


                <div className="modal-buttons">


                    <button
                    className="cancel-btn"
                    onClick={onCancel}
                    >
                        Cancel
                    </button>



                    <button
                    className="delete-btn"
                    onClick={onConfirm}
                    >
                        Delete
                    </button>


                </div>


            </div>


        </div>

    )

}


export default ConfirmModal;