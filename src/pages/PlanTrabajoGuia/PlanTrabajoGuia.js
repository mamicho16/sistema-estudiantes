import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import "./PlanTrabajoGuia.css";
import "../../components/ActivityCard/ActivityCard";
import userP from "../../images/userPhoto.jpg";

const PlanTrabajoGuia = () => {
    const activities = [
        {
            week: 3,
            activityType: "Charla",
            activityName: "Introducción a la programación",
            dateTime: "2024-03-05T10:00:00",
            responsibles: ["Ericka Solano", "Juan Pérez"],
            daysBeforeAnnounce: 7,
            reminderDays: 5,
            modality: "Presencial",
            link: "",
            poster: userP,
            state: "PLANEADA"
        },
        {
            week: 8,
            activityType: "Taller",
            activityName: "Uso de GitHub",
            dateTime: "2024-04-20T14:00:00",
            responsibles: ["Carlos Quesada"],
            daysBeforeAnnounce: 14,
            reminderDays: 10,
            modality: "Remota",
            link: "https://meet.google.com/unique-link",
            poster: userP,
            state: "NOTIFICADA",
            evidence: "https://some-link-to-recording.com"
        },
        {
            week: 12,
            activityType: "Seminario",
            activityName: "Seguridad Informática",
            dateTime: "2024-05-15T09:00:00",
            responsibles: ["Ana María Vargas", "Luis Méndez"],
            daysBeforeAnnounce: 10,
            reminderDays: 7,
            modality: "Presencial",
            link: "",
            poster: userP,
            state: "REALIZADA",
            evidence: ["list-of-images.jpg", "screenshot-01.jpg"]
        },
        {
            week: 15,
            activityType: "Conferencia",
            activityName: "Innovaciones en AI",
            dateTime: "2024-06-10T16:00:00",
            responsibles: ["María González"],
            daysBeforeAnnounce: 15,
            reminderDays: 12,
            modality: "Remota",
            link: "https://zoom.us/unique-session",
            poster: userP,
            state: "CANCELADA",
            cancellationNote: "Debido a un imprevisto con el expositor principal, la actividad ha sido cancelada.",
            cancellationDate: "2024-06-05"
        }
    ];

    return (
        <>
            <NavBar titulo="Plan de Trabajo" id="navBar" />
            <Helmet>
                <title>Plan de Trabajo - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="subtituloH">
                <h1>Lista de trabajos existentes</h1>
                <button className="add-button">+</button>
            </div>
                
            <div className="PlanTrabajoGuia">
                {activities.map((activity, index) => (
                    <div key={index} className="activity-full-container">
                        <ActivityCard activity={activity} />
                        <div className="activity-buttons">
                            <button type="button">Registrar</button>
                            <button type="button">Comentarios</button>
                            <button type="button">Editar</button>
                        </div>
                    </div>
                ))}
            </div>
                
            <div className="page-buttons">
                <button type="button">Regresar</button>
                <button type="button">Finalizar</button>
            </div>
        </>
    );
};

export default PlanTrabajoGuia;
