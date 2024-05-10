import React, { useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { Form, InputGroup, FormControl, Button, FormLabel } from "react-bootstrap";
import "./AgregarActividad.css";
import { Alerta } from "../../components/Alerta";
// import { getWeek } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from "../../firebase/firebase";




const AgregarActividad = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [week, setWeek] = useState('');
    const [activityType, setActivityType] = useState('');
    const [activityName, setActivityName] = useState('');
    const [responsibles, setResponsibles] = useState('');
    const [daysBeforeAnnounce, setDaysBeforeAnnounce] = useState(0);
    const [reminderDays, setReminderDays] = useState(0);
    const [modality, setModality] = useState('');
    const [link, setLink] = useState('');
    const [poster, setPoster] = useState(null);
    const [posterName, setPosterName] = useState('');
    const [state, setState] = useState('');

    const [alertState, setAlertState] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const uniqueFilename = `${uuidv4()}-${file.name}`; // Create a unique filename
            setPoster(file);
            setPosterName(uniqueFilename);
        }
    };

    // const handleDateChange = (e) => {
    //     const newDate = e.target.value;
    //     setDate(newDate);
    //     const dateObject = new Date(newDate);
    //     setWeek(getWeek(dateObject));
    // };



    return (
        <>
        <Helmet>
            <title>Agregar Actividad - Tecnológico de Costa Rica</title>
        </Helmet>
        <div>
            <NavBar titulo="Agregar Actividad"/>
            <div className="Container">
                <Form id="form">
                    <Form.Group className="input-control">
                        <Form.Label>Semana</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Semana"
                            value={week}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Nombre de la actividad</Form.Label>
                        <InputGroup>
                            <FormControl 
                            type="text" 
                            placeholder="Nombre de la actividad" 
                            value={activityName}/>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Fecha programada</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="datetime-local"
                            placeholder="Fecha programada"
                            value={date}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Responsables</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Responsables"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Button className="Button" variant="primary" type="submit">
                        Agregar
                    </Button>
                </Form>
            </div>
        </div>
        </>
    );
}

export default AgregarActividad;