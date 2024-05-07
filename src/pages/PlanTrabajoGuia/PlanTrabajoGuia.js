import React, { useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import "./PlanTrabajoGuia.css";
import "../../components/ActivityCard/ActivityCard";
import userP from "../../images/userPhoto.jpg";
import { useAuth } from "../../contexts/auth";
import { Modal } from "react-bootstrap";

const PlanTrabajoGuia = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const handleOnClick = () => {
        window.history.back();
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const comentarios = ["Comentario 1", "Comentario 2", "Comentario 3"];

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
                {user.coordinador && (
                    <button className="add-button">+</button>
                )}   
            </div>
                
            <div className="PlanTrabajoGuia">
                {activities.map((activity, index) => (
                    <div key={index} className="activity-full-container">
                        <ActivityCard activity={activity} />
                        <div className="activity-buttons">
                            {user.coordinador &&(
                            <>
                                <button type="button">Registrar</button>
                                
                                <button type="button">Editar</button>
                            </>
                            )}
                            <button type="button" onClick={handleShowModal}>Comentarios</button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Comentarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comentarios.map((comentario, index) => (
                        <div key={index} className="comentario">
                            <img src={comentario.fotoPerfil} alt="Foto de perfil" className="fotoPerfil" />
                            <div className="infoUsuario">
                                <p>{comentario.nombreUsuario}</p>
                                <p>{comentario.texto}</p>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" onClick={handleCloseModal}>Cerrar</button>
                </Modal.Footer>
            </Modal>

                
            <div className="page-buttons">
                <button type="button" onClick={handleOnClick}>Regresar</button>
            </div>
        </>
    );
};

export default PlanTrabajoGuia;
