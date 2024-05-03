import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard"; // Update this path as necessary
import userP from "../../images/userPhoto.jpg";
import './Historial.css';

const Historial = () => {
    const [searchTerm, setSearchTerm] = useState("");
    // Mock data array for users
    const users = [
        { name: "Nombre Apellido", imageUrl: userP, location: "San Jose", code: "SJ-04", email: "correo@estudiantec.cr", officeNumber: "NNNN-NNNN", cellNumber: "XXXX-XXXX" },
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
        <NavBar titulo="Historial"/>
        <Helmet>
            <title >Historial - Tecnológico de Costa Rica</title>
        </Helmet>
        <div className = ".subtituloH">
                 <h1> Historial docentes asignados </h1>
            </div>
        <div className="card-container">
                {filteredUsers.map(user => <UserCard key={user.email} user={user} />)}
        </div>
        <div>
            
            <div className="search-bar-container">
            <button class = "groupBtn" onClick={() => console.log('Regresar')}>Regresar</button>
                <button class = "groupBtn" onClick={() => console.log('Finalizar')}>Finalizar</button>
            
                <input
                    type="text"
                    placeholder="Ingrese la sede"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button class = "groupBtn" onClick={() => console.log('Buscar')}>Buscar</button>
                </div>

        </div>
        </>
    );
};

export default Historial;