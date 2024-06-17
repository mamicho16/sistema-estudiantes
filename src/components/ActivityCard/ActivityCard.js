import React, { useEffect, useState } from 'react';
import './ActivityCard.css';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { PublicationVisitor, ReminderVisitor, CancelationVisitor } from '../Visitor';
import notificationCenter from '../notificationCenter';
import activityObserver from '../activityObserver';

// activityInfo recibe los datos de la actividad para el componente
const ActivityCard = ({ activity }) => {

    // activityData guarda los datos de la actividad
    const [activityData, setActivityData] = useState(activity);
    const FECHA_SISTEMA = new Date();
    const navigate = useNavigate();
    const publicationVisitor = new PublicationVisitor();
    const reminderVisitor = new ReminderVisitor();
    const cancelationVisitor = new CancelationVisitor();


    // Función para manejar múltiples responsables
    const displayResponsibles = (responsibles) => {
        return responsibles.join(", ");
    };
    
 

    const handleVerEvi = (activityId) => {
        navigate(`/verEvidencia/${activityId}`);
    }


    useEffect(() => {
        const activityRef = doc(db, 'activities', activity.id);
        const unsuscribe = onSnapshot(activityRef, (doc) => {
            if (doc.exists()) {
                let id = activity.id;
                const newData = {id, ...doc.data()};
                setActivityData(newData);
                // Llamar a los visitantes
                publicationVisitor.visit(newData, FECHA_SISTEMA);
                reminderVisitor.visit(newData, FECHA_SISTEMA);
                cancelationVisitor.visit(newData, FECHA_SISTEMA);

            } else {
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching document: ", error);
        });

         // Suscribirse al observer
         notificationCenter.addObserver(activityObserver);
    
        return () => { 
            notificationCenter.removeObserver(activityObserver);
            unsuscribe();
        }
    }, [activity.id]);

    return (
        <div className="activity-card">
            <div className="activity-info">
                <img src={activityData.poster} alt="activity" className="activity-image" onClick={()=>handleVerEvi(activity.id)}/>
                <div className="activity-name">{activityData.activityName}</div>
                <div className="activity-type">{activityData.activityType}</div>
            </div>
            <div className="activity-details">
                <div><strong>Fecha:</strong> {new Date(activityData.dateTime).toLocaleDateString()}</div>
                <div><strong>Hora:</strong> {new Date(activityData.dateTime).toLocaleTimeString()}</div>
                <div><strong>Semana:</strong> {activityData.week}</div>
                <div><strong>Docente responsable:</strong> {displayResponsibles(activityData.responsibles)}</div>
                <div><strong>Dias antes de anunciar:</strong> {activityData.daysBeforeAnnounce}</div>
                <div><strong>Dias recordatorio:</strong> {activityData.reminderDays}</div>
                <div><strong>Modalidad:</strong> {activityData.modality}</div>
                <div><strong>Enlace:</strong> {activityData.modality === "Remota" ? <a href={activityData.link} target="_blank">Link</a> : "N/A"}</div>
                <div><strong>Estado:</strong> {activityData.state}</div>
            </div>
        </div>
    );
};

export default ActivityCard;