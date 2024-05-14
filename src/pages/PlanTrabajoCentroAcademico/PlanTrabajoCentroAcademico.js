import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import "./PlanTrabajoCentroAcademico.css";
import "../../components/ActivityCard/ActivityCard";
//import { Modal } from "react-bootstrap";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";


const PlanTrabajoCentroAcademico = () => {
    const [activities, setActivities] = useState([]);  // Almacena todas las actividades
    const [displayedActivity, setDisplayedActivity] = useState(null);  // Almacena la actividad a mostrar
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const snapshot = await getDocs(collection(db, "activities"));
            const activitiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
            setActivities(activitiesData);
            setDisplayedActivity(activitiesData);  // Inicialmente mostrar todas las actividades
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    const handleFindClosestActivity = () => {
        const now = new Date();
        // Filtra las actividades que aún no han pasado y cuyo estado sea 'PLANEADA' o 'NOTIFICADA'
        const futureActivities = activities.filter(activity => {
            const activityDate = new Date(activity.dateTime);
            return activityDate > now && (activity.state === "PLANEADA" || activity.state === "NOTIFICADA");
        });
    
        if (futureActivities.length > 0) {
            const closest = futureActivities.reduce((closest, current) => {
                const closestDate = new Date(closest.dateTime);
                const currentDate = new Date(current.dateTime);
                return (closestDate - now < currentDate - now) ? closest : current;
            });
    
            setDisplayedActivity([closest]);  // Mostrar solo la actividad más cercana
        } else {
            setDisplayedActivity([]);  // Si no hay actividades futuras que cumplan las condiciones, mostrar un arreglo vacío
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
            </div>

            <div className="PlanTrabajoGuia">
                {displayedActivity && displayedActivity.length > 0 ? (
                    displayedActivity.map((activity, index) => (
                        <div key={index} className="activity-full-container">
                            <ActivityCard activity={activity} />
                        </div>
                    ))
                ) : (
                    <p>No hay actividades próximas.</p>
                )}
            </div>

            <div className="page-buttons">
                <button type="button" onClick={handleFindClosestActivity}>Consultar Último Proyecto</button>
            </div>
        </>
    );
};

export default PlanTrabajoCentroAcademico;
