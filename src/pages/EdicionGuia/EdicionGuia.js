import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard";
import userP from "../../images/userPhoto.jpg";


const EquipoGuia = () => {
    const users = [
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "Cartago", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "Alajuela", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
    ];
    return (
        <>
            <NavBar titulo="Equipo Guía" id/>
            <Helmet>
                <title>Equipo Guía - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="subtituloH">
                <h1>Docentes Asignados</h1>
            </div>
            <div className="card-container">
                {users.map(user => (
                    <div className="user-card-wrapper" key={user.email} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <UserCard user={user} />
                        <div style={{ marginTop: '10px' }}>
                            <button type="button">Detalles</button>
                            <button type="button">Contactar</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default EquipoGuia;