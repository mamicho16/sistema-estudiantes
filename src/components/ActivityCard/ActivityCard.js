import React from 'react';
import './ActivityCard.css';


const ActivityCard = ({ activity }) => {
    // Función para manejar múltiples responsables
    const displayResponsibles = (responsibles) => {
        return responsibles.join(", ");
    };

    return (
        <div className="activity-card">
            <div className="activity-info">
                <img src={activity.poster} alt="activity" className="activity-image"/>
                <div className="activity-name">{activity.activityName}</div>
                <div className="activity-type">{activity.activityType}</div>
            </div>
            <div className="activity-details">
                <div><strong>Fecha:</strong> {new Date(activity.dateTime).toLocaleDateString()}</div>
                <div><strong>Hora:</strong> {new Date(activity.dateTime).toLocaleTimeString()}</div>
                <div><strong>Semana:</strong> {activity.week}</div>
                <div><strong>Docente responsable:</strong> {displayResponsibles(activity.responsibles)}</div>
                <div><strong>Dias previos:</strong> {activity.daysBeforeAnnounce}</div>
                <div><strong>Dias requeridos:</strong> {activity.reminderDays}</div>
                <div><strong>Modalidad:</strong> {activity.modality}</div>
                <div><strong>Enlace:</strong> {activity.modality === "Remota" ? <a href={activity.link}>Link</a> : "N/A"}</div>
                <div><strong>Estado:</strong> {activity.state}</div>
            </div>
        </div>
    );
};

export default ActivityCard;