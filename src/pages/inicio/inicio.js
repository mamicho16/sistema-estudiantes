import React from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import fotoP from "../../images/tec.png";
import logotec from "../../images/logotec.png";
import './Inicio.css';
import { useNavigate } from "react-router-dom";

const Inicio = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handlePlanTrabajo = () => {
        navigate("/planTrabajoGuia");
    }
    const handleListaDeEstudiantes = () => {
        navigate("/ListaDeEstudiantes");
    }
    const handleListaDeEstudiantesProfesores = () => {
        navigate("/ListaDeEstudiantesProfesores");
    }
    let admin = false;
    let coordinador = false;

    if (user.coordinador === undefined) {
        admin = true;
    }
   else if (user.coordinador) {
        coordinador = true;
    }
    else {
        coordinador = false;
    }

    const handleInfoProfes = () => {
        navigate("/edicionGuia");
    }
    
    const handleHistoProfes = () => {
        navigate("/historial");
    }

    const handleEquipoGuia = () => {
        navigate("/equipoGuia");
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
                { admin &&(
                <>
                    <button className="menu-button" onClick={handleInfoProfes}>Información Profesores</button>
                    <button className="menu-button" onClick={handleHistoProfes}>Historial Profesores</button>
                    <button className="menu-button" onClick={handleListaDeEstudiantesProfesores}>Información Estudiantes</button>
                    <button className="menu-button">Detalle Actividades</button>
                    <button className="menu-button" onClick={handleListaDeEstudiantes}>Lista Estudiantes</button> 
                </>)}
                {coordinador &&(
                    <>
                        <button className="menu-button" onClick={handleListaDeEstudiantesProfesores}>Lista Estudiantes</button> 
                    </>
                )}
                {!coordinador && !admin &&(
                    <>
                        <button className="menu-button" onClick={handleListaDeEstudiantesProfesores}>Lista Estudiantes</button> 

                    </>
                )}
                <button className="menu-button" onClick={handleEquipoGuia}>Equipo Guia</button>
                <button className="menu-button" onClick={handlePlanTrabajo}>Plan de Trabajo</button>
            </div>
        </div>
        </>
    );
}

export default Inicio;