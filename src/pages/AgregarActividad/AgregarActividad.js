import React, { useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { Form, InputGroup, FormControl, Button, FormLabel } from "react-bootstrap";
import "./AgregarActividad.css";




const AgregarActividad = () => {
    const [nombreActividad, setNombreActividad] = useState("");
    const [semana, setSemana] = useState("");
    const [fecha, setFecha] = useState("");

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
                            value={semana}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Nombre de la actividad</Form.Label>
                        <InputGroup>
                            <FormControl 
                            type="text" 
                            placeholder="Nombre de la actividad" 
                            value={nombreActividad}/>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Fecha programada</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="datetime-local"
                            placeholder="Fecha programada"
                            value={fecha}
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