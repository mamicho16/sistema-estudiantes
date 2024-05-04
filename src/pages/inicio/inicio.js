import React from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import fotoP from "../../images/tec.png";
import logotec from "../../images/logotec.png";
import './Inicio.css';
import { useNavigate } from "react-router-dom";

const Inicio = () => {
    // const { user } = useAuth();
    // console.log(user);
    const navigate = useNavigate();
    const handlePlanTrabajo = () => {
        navigate("/planTrabajoGuia");
    }
    return (
        <>
        <Helmet>
            <title>Inicio - Tecnológico de Costa Rica</title>
        </Helmet>
        <div>
            <NavBar titulo="Inicio"/>
            <div className="logo-image">
            <img src= {logotec} alt="Tecnológico de Costa Rica" />
            </div>
            <div className="main-image">
                {/* You can use an <img> tag or a div with background-image depending on your preference */}
                <img src= {fotoP} alt="Tecnológico de Costa Rica" />
            </div>
           <div className = "subtitulo">
                 <h1> Que desea realizar? </h1>
            </div>
            <div className="button-container">
                <button className="menu-button">Información Profesores</button>
                <button className="menu-button">Historial Profesores</button>
                <button className="menu-button">Información Estudiantes</button>
                <button className="menu-button">Detalle Actividades</button>
                <button className="menu-button" onClick={handlePlanTrabajo}>Plan de Trabajo</button>
            </div>
        </div>
        </>
    );
}

export default Inicio;