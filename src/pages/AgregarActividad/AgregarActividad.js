import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { Form, InputGroup, FormControl, Button, FormLabel} from "react-bootstrap";
import "./AgregarActividad.css";
import Alerta  from "../../components/Alerta";
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from "../../firebase/firebase";




const AgregarActividad = () => {
    const navigate = useNavigate();
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
    const [alertMessage, setAlertMessage] = useState({});

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const uniqueFilename = `${uuidv4()}-${file.name}`; // Create a unique filename
            setPoster(file);
            setPosterName(uniqueFilename);
        }
    };

    const backButton = () => {  
        navigate("/planTrabajoGuia");
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
    };

    const handleModalityChange = (e) => {
        setModality(e.target.value);
        if (modality !== "Remota") {
            setLink("No aplica");
        } else if (modality === "Remota") {
            setLink("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertState(false);
        setAlertMessage("");

        if (activityName === "" || activityType === "" || date === "" || time === "" || week === "" || responsibles === "" || daysBeforeAnnounce === "" || reminderDays === "" || modality === "" || poster === null) {
            setAlertState(true);
            setAlertMessage({tipo: "error", mensaje: "Todos los campos son obligatorios"});
            return;
        }

        try {
            const storageRef = storage.ref();
            const posterRef = storageRef.child(`posters/${posterName}`);
            await posterRef.put(poster);
            const posterURL = await posterRef.getDownloadURL();

            // Combine the date and time into a firebase datetime object
            const dateTime = new Date(`${date}T${time}:00`);
            const isoDateTime = dateTime.toISOString();
            // Separate the responsibles into an array, splitting by commas
            const responsibles = responsibles.split(",").map((responsible) => responsible.trim());



            await db.collection("activities").add({
                activityName,
                activityType,
                dateTime: isoDateTime,
                week,
                responsibles,
                daysBeforeAnnounce,
                reminderDays,
                modality,
                link,
                poster: posterURL,
                state: "PLANEADA",
                justification: ""
            });

            setAlertState(true);
            setAlertMessage({tipo: "exito", mensaje: "Actividad agregada correctamente"});
            navigate("/planTrabajoGuia");
        } catch (error) {
            console.error("Error adding activity:", error);
            setAlertState(true);
            setAlertMessage({tipo: "exito", mensaje: "Ocurrió un error al agregar la actividad"});
        }
    };



    return (
        <>
        <Helmet>
            <title>Agregar Actividad - Tecnológico de Costa Rica</title>
        </Helmet>
        <div>
            <NavBar titulo="Agregar Actividad"/>
            <div className="Container">
                <Form id="form" onSubmit={handleSubmit}>

                    <Form.Group className="input-control">
                        <Form.Label>Nombre de la actividad</Form.Label>
                        <InputGroup>
                            <FormControl 
                            type="text" 
                            placeholder="Nombre de la actividad" 
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Tipo de actividad</Form.Label>
                        <InputGroup>
                            <Form.Select aria-label="Tipo de actividad" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                                <option value="">Seleccione un tipo de actividad</option>
                                <option value="Orientadora">Orientadora</option>
                                <option value="Motivacional">Motivacional</option>
                                <option value="Apoyo a la vida estudiantil">Apoyo a la vida estudiantil</option>
                                <option value="Orden tecnico">Orden tecnico</option>
                                <option value="Recreacion">Recreacion</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Fecha programada</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="date"
                            placeholder="Fecha programada"
                            value={date}
                            onChange={handleDateChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Hora programada</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="time"
                            placeholder="Hora programada"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Semana</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="number"
                            placeholder="Semana"
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            min="1"
                            max="16"
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Semana del semestre en la que se realizará la actividad.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Responsables</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Responsables"
                            value={responsibles}
                            onChange={(e) => setResponsibles(e.target.value)}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Ingrese los nombres de los responsables separados por comas.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Días antes de anunciar</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="number"
                            placeholder="Días antes de anunciar"
                            value={daysBeforeAnnounce}
                            onChange={(e) => setDaysBeforeAnnounce(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Días de recordatorio</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="number"
                            placeholder="Días de recordatorio"
                            value={reminderDays}
                            onChange={(e) => setReminderDays(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Modalidad</Form.Label>
                        <InputGroup>
                            <Form.Select aria-label="Modalidad" value={modality} onChange={handleModalityChange}>
                                <option value="">Seleccione una modalidad</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Remota">Remota</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Link</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Link"
                            value={link}
                            disabled={modality !== "Remota"}
                            readOnly={modality !== "Remota"}
                            onChange={(e) => setLink(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Cartel</Form.Label>
                        <InputGroup>
                            <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button className="Button" variant="primary" type="submit">
                        Agregar
                    </Button>
                    
                    <Button className="Button" variant="secondary" type="button" onClick={backButton}>
                    Regresar
                    </Button>
                </Form>

            </div>
        </div>
        
        <Alerta
            tipo={alertMessage.tipo}
            mensaje={alertMessage.mensaje}
            estadoAlerta={alertState}
            setEstadoAlerta={setAlertState}
        />
        </>
    );
}

export default AgregarActividad;