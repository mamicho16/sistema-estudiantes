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
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [estadoAlerta, setestadoAlerta] = useState(false);
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
        setestadoAlerta(false);
        setMensaje({});

        const expresion = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        const emailValido = expresion.test(email);

        if(password === ""|| email === ""){
            setestadoAlerta(true);
            setMensaje({tipo: 'error', mensaje: 'Todos los campos son obligatorios'});
            return;
        }

        if(!emailValido){
            setestadoAlerta(true);
            setMensaje({tipo: 'error', mensaje: 'Correo no válido'});
            return;
        }

        try {
            login(email, password);
            navigate("/");
        } catch (error) {
            setestadoAlerta(true);
            let mensaje;
            switch(error.code){
                case 'auth/wrong-password':
                    mensaje = 'Contraseña incorrecta';
                    break;
                case 'auth/user-not-found':
                    mensaje = 'Usuario no encontrado';
                    break;
                case 'auth/invalid-email':
                    mensaje = 'Correo no válido';
                    break;
                default:
                    mensaje = 'Hubo un error al intentar ingresar';
                    break;
            }
            setMensaje({tipo: 'error', mensaje: mensaje});
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
                                <div className="text-center">
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
                setestadoAlerta={setestadoAlerta}  
            />
        </>
    );
}

export default IniciarSesion;