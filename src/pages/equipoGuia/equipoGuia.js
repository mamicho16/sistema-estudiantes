import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard"; // Update this path as necessary
import userP from "../../images/userPhoto.jpg";
import './equipoGuia.css';

const EquipoGuia = () => {
    // const { user } = useAuth();
    // console.log(user);
    const [searchTerm, setSearchTerm] = useState("");
    // Mock data array for users
    const users = [
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
       
    
        // Repeat for each user, total 6 users or more
    ];

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <NavBar titulo="Equipo Guia"/>
        <Helmet>
            <title >Equipo Guia - Tecnológico de Costa Rica</title>
        </Helmet>
        <div className = ".subtituloH">
                 <h1> Equipo Guia de docentes asignados </h1>
            </div>
        <div className="card-container">
                {filteredUsers.map(user => <UserCard key={user.email} user={user} />)}
        </div>
        </>
    );
};

export default EquipoGuia;