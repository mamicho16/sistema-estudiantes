import React, { useState, useEffect } from 'react';
import "./EditProfesor.css";
import { useAuth } from "../../contexts/auth";

function EditProfessorModal({ professor, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: professor.name,
        email: professor.email,
        location: professor.location,
        officeNumber: professor.officeNumber,
        cellNumber: professor.cellNumber,
        coordinador: professor.coordinador
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        setFormData({
            name: professor.name,
            email: professor.email,
            location: professor.location,
            officeNumber: professor.officeNumber,
            cellNumber: professor.cellNumber,
            coordinador: professor.coordinador
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

    const { user } = useAuth();
    const admin = user.coordinador === undefined;
    const cartago = user.sede === "Cartago";

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
                {admin && cartago && (
                    <>
                        <label>Coordinador:</label>
                        <input
                            type="checkbox"
                            name="coordinador"
                            checked={formData.coordinador}
                            onChange={handleChange}
                        />
                    </>
                )}
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}
export default EditProfessorModal;
