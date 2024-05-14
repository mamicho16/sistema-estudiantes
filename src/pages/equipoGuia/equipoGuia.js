import React from "react";
import { useState } from "react";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard"; // Update this path as necessary

import './equipoGuia.css';
import { getProfessors} from "../../contexts/profesor";


const EquipoGuia = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    React.useEffect(() => {
        const fetchAndConvertProfessors = async () => {
            try {
                const professors = await getProfessors();
                const coordinators = professors.filter(professor => professor.estado === true);
                const usersData = coordinators.map(professor => ({
                    name: `${professor.nombre} ${professor.nombre2 || ''} ${professor.apellido1} ${professor.apellido2}`,
                    imageUrl: professor.foto,
                    location: professor.sede,
                    code: professor.codigo,
                    email: professor.email,
                    officeNumber: professor.numOficina,
                    cellNumber: professor.celular
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching professors: ", error);
            }
        };
    
        fetchAndConvertProfessors();
    }, []);

    // Filter users based on selected location
    const filteredUsers = selectedLocation ? users.filter(user => user.location === selectedLocation) : users;

    return (
        <>
            <NavBar titulo="Equipo Guia"/>
            <Helmet>
                <title>Equipo Guia - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className=".subtituloH">
                <h1>Equipo Guia de docentes asignados</h1>
            </div>
            <div className="dropdown-container">
                <select onChange={(e) => setSelectedLocation(e.target.value)} className="location-dropdown">
                    <option value="">Escoge la Sede</option>
                    <option value="Cartago">Cartago</option>
                    <option value="San Jose">San Jose</option>
                    <option value="Limon">Limon</option>
                    <option value="San Carlos">San Carlos</option>
                    <option value="Puntarenas">Puntarenas</option>
                </select>
            </div>
            <div className="card-container">
                {filteredUsers.map(user => <UserCard key={user.email} user={user} />)}
            </div>
        </>
    );
};

export default EquipoGuia;