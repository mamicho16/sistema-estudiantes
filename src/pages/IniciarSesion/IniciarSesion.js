import React, {useState, useEffect} from "react";
import ContainerInicioSesion from "../../components/ContainerInicioSesion";
import { Helmet } from 'react-helmet';
import "./IniciarSesion.css"
import {Form, InputGroup, FormControl, Button} from "react-bootstrap";
import fotoP from "../../images/fotoP.png";
import Alerta from "../../components/Alerta";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth";



const IniciarSesion = () => {
    const { login, register, registerAdmin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [mensaje, setMensaje] = useState({});

    const handleChange = (e) => {
        if(e.target.id === "email"){
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoAlerta(false);
        setMensaje({});

        const expresion = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        const emailValido = expresion.test(email);

        if(password === ""|| email === ""){
            setEstadoAlerta(true);
            setMensaje({tipo: 'error', mensaje: 'Todos los campos son obligatorios'});
            return;
        }

        if(!emailValido){
            setEstadoAlerta(true);
            setMensaje({tipo: 'error', mensaje: 'Correo no válido'});
            return;
        }

        try {
            const success = await login(email, password);
            if (success) {
                 navigate("/"); // Navegar a la página de inicio solo si el login es exitoso
             } else {
                setEstadoAlerta(true);
                setMensaje({ tipo: 'error', mensaje: 'No se pudo iniciar sesión' });
            }
        }
        catch (error) {
            console.error("Error en login:", error);
            setEstadoAlerta(true);
            setMensaje({ tipo: 'error', mensaje: 'No se pudo iniciar sesión' });
        }
    }
    return (
        <>
            <Helmet>
                <title>Iniciar sesión</title>
            </Helmet>
            
            <ContainerInicioSesion>
            <div className = "container">
                <div className = "row img" >
                    <div className="col">
                        <img src= {fotoP} alt="fotoP" className="mx-auto"/>
                    </div>

                    <div className="col centered-column">
                        <h1 className="h1-custom"> Ingrese su usuario </h1>
                        <Form id="form" onSubmit={handleSubmit}>
                            <Form.Group className="input-control">
                                <Form.Label htmlFor="email"> </Form.Label>
                                <InputGroup>
                                    <FormControl
                                        type="email"
                                        id="email"
                                        value={email}
                                        placeholder="Email"
                                        onChange={handleChange}
                                        
                                    />
                                    <div className="error"></div>
                                </InputGroup>
                            </Form.Group>
                                <Form.Group className="input-control">
                                    <Form.Label htmlFor="password"></Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="password"
                                            id="password"
                                            value={password}
                                            placeholder="Password"
                                            onChange={handleChange}
                                            
                                        />
                                        <div className="error"></div>
                                    </InputGroup>
                                </Form.Group>
                                <div className="text-center h-custom">
                                <a href="/forgot-password" className="forgot-password-link">¿Olvidó su contraseña?</a>
                                <Button className="boton" type="submit" id="submit">Log In</Button>    
                                </div>
                        </Form>
                    </div>
                </div>
            </div>
            </ContainerInicioSesion>
            <Alerta 
                tipo={mensaje.tipo}
                mensaje={mensaje.mensaje} 
                estadoAlerta={estadoAlerta}
                setestadoAlerta={setEstadoAlerta}  
            />
        </>
    );
}

export default IniciarSesion;