const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
