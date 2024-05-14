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
import { collection, getDocs } from "firebase/firestore";
import { Modal , Button } from "react-bootstrap";
import {guardarComentario, obtenerComentariosPorActividad} from "../../contexts/comentario";
import UploadActivityImagesModal from "../../components/RegisterActivity/RegisterActivity";
import EditActivityModal from "../../components/EditActivity/EditActivity";
import { doc, updateDoc } from "firebase/firestore";


const PlanTrabajoGuia = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [activities, setActivities] = useState([]); 
    const [IndexActivity, setIndexActivity] = useState(0); 
    const navigate = useNavigate();
    const [editingActivity, setEditingActivity] = useState(null);
    const [editeActivity, setEditActivity] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleOnClick = () => {
        window.history.back();
    };

    const handleShowModal = () => {
        console.log(activities[IndexActivity].id);
        obtenerComentariosPorActividad(activities[IndexActivity].id)
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


    useEffect(() => {
         const fetchActivities = async () => {
             try { 
                 const snapshot = await getDocs(collection(db, "activities"));
                 const activitiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
                 setActivities(activitiesData);
                 console.log(activitiesData);
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

            await guardarComentario(userMail, comentarioNuevo, activities[IndexActivity].id);

            //setComentarios([...comentarios, comentario]);

            setComentarioNuevo("");
            
            handleShowModal();
            //setShowModal(false);
        } catch (error) {
            console.error("Error al publicar comentario:", error);
        }
    };

    const handleEdit = (activity) => {
        console.log("Editing activity:", activity);
        setEditingActivity(activity);
        setShowUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
    };

    const handleEditAct = (activity) => {
        console.log("Editing activity:", activity);
        setEditActivity(activity);
        setShowEditModal(true);
    };

    const handleSaveChanges = async (activityId, formData) => {
        const activityRef = doc(db, "activities", activityId);
        try {
            await updateDoc(activityRef, formData);
            console.log("Activity updated successfully!");
            setShowEditModal(false); // Cerrar modal después de guardar
        } catch (error) {
            console.error("Error updating activity:", error);
            alert("Failed to update activity.");
        }
    };


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
                                <button type="button" onClick={() => handleEdit(activity)}>Registrar Evidencia</button>
                                
                                <button type="button" onClick={() => handleEditAct(activity)}>Editar Actividad</button>
                            </>
                            )}
                            <button type="button" onClick={() => {handleShowModal(); setIndexActivity(index);}}>Comentarios</button>
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

            {showUploadModal && (
                <UploadActivityImagesModal activity={editingActivity} onClose={handleCloseUploadModal}/>
            )}                
            {showEditModal && (
                <EditActivityModal
                    activity={editeActivity}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveChanges}
                />
            )}

                
            <div className="page-buttons">
                <button type="button" onClick={handleOnClick}>Regresar</button>
            </div>
        </>
    );
};

export default PlanTrabajoGuia;
