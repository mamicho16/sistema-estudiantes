import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarioEstudiantes.css";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import NavBar from "../../components/navBar/navBar";
import { Helmet } from "react-helmet";
import ModalActivity from "../../components/ModelActivity/modelActivity";

const localizer = momentLocalizer(moment);

const CalendarioEstudiantes = () => {
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleSelectEvent = (event) => {
        setSelectedActivity(event);
        setShowModal(true);
    };

    const handleFindClosestActivity = () => {
        const now = new Date();
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
            setSelectedActivity(closest);
            setShowModal(true);
        } else {
            console.log("No hay actividades futuras");
            setSelectedActivity(null);
            setShowModal(false);
        }
    };

    const fetchActivities = async () => {
        const snapshot = await getDocs(collection(db, "activities"));
        const activitiesData = snapshot.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data(),
            dateTime: new Date(doc.data().dateTime).toISOString()
        }));
        setActivities(activitiesData);
    };

    return (
        <>
            <NavBar titulo="Calendario" id="navBar" />
            <Helmet>
                <title>Calendario - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={activities}
                    titleAccessor="activityName"
                    startAccessor="dateTime"
                    endAccessor="dateTime"
                    className="calendar"
                    onSelectEvent={handleSelectEvent}
                />
                <div className="button-container1">
                    <button className="button1" onClick={handleFindClosestActivity}>
                        Consultar Último Proyecto
                    </button>
                </div>
            </div>
            
            {showModal && selectedActivity && (
                <ModalActivity onClose={() => setShowModal(false)}>
                    
                    <h3>{selectedActivity.activityName}</h3>
                    <img src={selectedActivity.poster}></img>
                    <p><strong>Fecha:</strong> {new Date(selectedActivity.dateTime).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {new Date(selectedActivity.dateTime).toLocaleTimeString()}</p>
                    <p><strong>Modalidad:</strong> {selectedActivity.modality}</p>
                    <p><strong>Estado:</strong> {(selectedActivity.state).charAt(0).toUpperCase() + (selectedActivity.state).slice(1).toLowerCase() }</p>
                </ModalActivity>
            )}
        </>
    );
};

export default CalendarioEstudiantes;
