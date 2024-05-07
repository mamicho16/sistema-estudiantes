import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard"; // Update this path as necessary
import userP from "../../images/userPhoto.jpg";
import './equipoGuia.css';
import { getProfessors} from "../../contexts/profesor";

const EquipoGuia = () => {
    // const { user } = useAuth();
    // console.log(user);
    const [searchTerm, setSearchTerm] = useState("");
    // Mock data array for users

    const [users, setUsers] = useState([]);
    React.useEffect(() => {
        const fetchAndConvertProfessors = async () => {
            try {
                const professors = await getProfessors();
                const coordinators = professors.filter(professor => professor.coordinador === true);  // Filtering coordinators
                const usersData = coordinators.map(professor => ({
                    name: professor.nombre + " " + (professor.nombre2 || '') + " " + professor.apellido1 + " " + professor.apellido2,
                    imageUrl: professor.foto,
                    location: professor.campus + " ",
                    code: professor.codigo, // Adjust if professor data structure has a Codigo property
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