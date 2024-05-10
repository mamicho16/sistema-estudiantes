import React, { useState, useEffect } from 'react';
import "./EditProfesor.css";

function EditProfessorModal({ professor, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: professor.name,
        email: professor.email,
        location: professor.location,
        officeNumber: professor.officeNumber,
        cellNumber: professor.cellNumber
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setFormData({
            name: professor.name,
            email: professor.email,
            location: professor.location,
            officeNumber: professor.officeNumber,
            cellNumber: professor.cellNumber
        });
    }, [professor]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Saving changes for professor:', professor.code, formData);
            await onSave(professor.code, formData); // Pasar el código y los nuevos datos
            onClose(); // Cerrar modal después de guardar
        } catch (error) {
            console.error('Failed to update professor:', error);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                <label>Office Number:</label>
                <input type="text" name="officeNumber" value={formData.officeNumber} onChange={handleChange} />
                <label>Cell Number:</label>
                <input type="text" name="cellNumber" value={formData.cellNumber} onChange={handleChange} />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}
export default EditProfessorModal;