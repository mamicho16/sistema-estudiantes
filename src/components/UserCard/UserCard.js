import React from 'react';
import './UserCard.css'; // Link to the CSS file for styling

const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            <div className="user-info">
                <img src={user.imageUrl} alt="user" className="user-image"/>
                <div className="user-name">{user.name}</div>
            </div>
            <div className="user-details">
                <div><strong>Sede:</strong> {user.location}</div>
                <div><strong>Codigo:</strong> {user.code}</div>
                <div><strong>Correo Electronico:</strong> {user.email}</div>
                <div><strong>Número Oficina:</strong> {user.officeNumber}</div>
                <div><strong>Telefono Celular:</strong> {user.cellNumber}</div>
                <div><strong>Coordinador:</strong> {user.coordinador ? 'Sí' : 'No'}</div>
            </div>
        </div>
    );
};
export default UserCard;