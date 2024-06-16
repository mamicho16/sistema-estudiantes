import React from "react";
import "./modelActivity.css"; // Asegúrate de crear este archivo CSS

const ModalActivity = ({ children, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalActivity;