import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import "./PlanTrabajoGuia.css";
import "../../components/ActivityCard/ActivityCard";
import userP from "../../images/userPhoto.jpg";
import { useAuth } from "../../contexts/auth";
//import { Modal } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import { getDocs } from "firebase/firestore";
import { Modal , Button } from "react-bootstrap";
import {guardarComentario, obtenerComentariosPorActividad} from "../../contexts/comentario";

const PlanTrabajoGuia = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [activity, setActivities] = useState([]); 
    const navigate = useNavigate();

    const handleOnClick = () => {
        window.history.back();
    };

    const handleShowModal = () => {
        obtenerComentariosPorActividad(1)
            .then(comentarios => {
                setComentarios(comentarios);
                setShowModal(true);
            })
            .catch (error => {
                setShowModal(true);
                console.error("No hay comentarios");
            });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const addActivity = () => {
        navigate("/agregarActividad");
    };

    const editActivity = () => {
        navigate("/editarActividad");
    };

    const registerEvidence = () => {
        navigate("/registrarEvidencia");
    };


    useEffect(() => {
         const fetchActivities = async () => {
             try { 
                 const snapshot = await getDocs(db.collection("activities"));
                 const activitiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
                 setActivities(activitiesData);
             } catch (error) {
                 console.error("Error fetching activities:", error);
             }
         };

         fetchActivities();
    }, []);

    //const comentarios = ["Comentario 1", "Comentario 2", "Comentario 3"];

    const [comentarioNuevo, setComentarioNuevo] = useState("");
    const [comentarios, setComentarios] = useState([]);

    const handleOnChangeComentario = (event) => {
        setComentarioNuevo(event.target.value);
    };

    const handlePublicarComentario = async () => {
        try {
            const userMail = user.email;
            //console.log("Valor de idUsuario:", userMail);

            await guardarComentario(userMail, comentarioNuevo, 1);

            //setComentarios([...comentarios, comentario]);

            setComentarioNuevo("");
            
            handleShowModal();
            //setShowModal(false);
        } catch (error) {
            console.error("Error al publicar comentario:", error);
        }
    };



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
                    <button className="add-button" onClick={addActivity}>+</button>
                )} 
            </div>
                
            <div className="PlanTrabajoGuia">
                {activities.map((activity, index) => (
                    <div key={index} className="activity-full-container">
                        <ActivityCard activity={activity} />
                        <div className="activity-buttons">
                            {user.coordinador &&(
                            <>
                                <button type="button">Registrar Evidencia</button>
                                
                                <button type="button">Editar Actividad</button>
                            </>
                            )}
                            <button type="button" onClick={handleShowModal}>Comentarios</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Comentarios</h2>
                        {/* Lista de comentarios */}
                        <div className="comentarios-lista">
                            {comentarios.map((comentario, index) => (
                                <div key={index} className="comentario">
                                    <p>Usuario: {comentario.emailUsuario}</p>
                                    <p>Comentario: {comentario.texto}</p>
                                </div>
                            ))}
                        </div>
                        {/* Formulario para añadir comentario */}
                        <div className="comentario-nuevo">
                            <textarea value={comentarioNuevo} onChange={handleOnChangeComentario} placeholder="Escribe tu comentario aquí..." />
                            <button onClick={handlePublicarComentario}>Publicar</button>
                        </div>
                    </div>
                </div>
            )}

                
            <div className="page-buttons">
                <button type="button" onClick={handleOnClick}>Regresar</button>
            </div>
        </>
    );
};

export default PlanTrabajoGuia;
