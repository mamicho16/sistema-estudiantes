import React, { useEffect } from 'react';
import './ActivityCard.css';
import { useNavigate } from 'react-router-dom';


const ActivityCard = ({ activity }) => {
    // Función para manejar múltiples responsables
    const displayResponsibles = (responsibles) => {
        return responsibles.join(", ");
    };
    
    const navigate = useNavigate();

    const handleVerEvi = (activityId) => {
        navigate(`/verEvidencia/${activityId}`);
    }

    useEffect(() => {
        const activityRef = doc(db, 'activities', activity.id);
        const unsuscribe = onSnapshot(activityRef, (doc) => {
            if (doc.exists()) {
                const activityData = doc.data();
                setActivity(activityData);

                const currentDate = new Date();
                const publicationVisitor = new PublicationVisitor();
                const reminderVisitor = new ReminderVisitor();

                publicationVisitor.visit(activityData, currentDate);
                reminderVisitor.visit(activityData, currentDate);
            }
        });

        return () => unsuscribe();
    }, [activity.id]);

    return (
        <div className="activity-card">
            <div className="activity-info">
                <img src={activity.poster} alt="activity" className="activity-image" onClick={()=>handleVerEvi(activity.id)}/>
                <div className="activity-name">{activity.activityName}</div>
                <div className="activity-type">{activity.activityType}</div>
            </div>
            <div className="activity-details">
                <div><strong>Fecha:</strong> {new Date(activity.dateTime).toLocaleDateString()}</div>
                <div><strong>Hora:</strong> {new Date(activity.dateTime).toLocaleTimeString()}</div>
                <div><strong>Semana:</strong> {activity.week}</div>
                <div><strong>Docente responsable:</strong> {displayResponsibles(activity.responsibles)}</div>
                <div><strong>Dias antes de anunciar:</strong> {activity.daysBeforeAnnounce}</div>
                <div><strong>Dias recordatorio:</strong> {activity.reminderDays}</div>
                <div><strong>Modalidad:</strong> {activity.modality}</div>
                <div><strong>Enlace:</strong> {activity.modality === "Remota" ? <a href={activity.link} target="_blank">Link</a> : "N/A"}</div>
                <div><strong>Estado:</strong> {activity.state}</div>
            </div>
        </div>
    );
};

export default ActivityCard;