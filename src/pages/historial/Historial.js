import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard"; // Update this path as necessary
import userP from "../../images/userPhoto.jpg";
import './Historial.css';
import { getProfessors, addProfessorToFirestore } from "../../contexts/profesor";



const Historial = () => {
    // const { user } = useAuth();
    // console.log(user);
    const [searchTerm, setSearchTerm] = useState("");
    // Mock data array for users
    const [users, setUsers] = useState([]);

    React.useEffect(() => {
        const fetchAndConvertProfessors = async () => {
            try {
                const professors = await getProfessors();
                const usersData = professors.map(professor => ({
                    name: professor.Name,
                    imageUrl: professor.Photo,
                    location: professor.Sede,
                    code: professor.Codigo, // Adjust if professor data structure has a Codigo property
                    email: professor.CorreoElectronico,
                    officeNumber: professor.NumeroOficina,
                    cellNumber: professor.TelefonoCelular
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching professors: ", error);
            }
        };

        fetchAndConvertProfessors();
    }, []); // Empty dependency array to run only once on component mount


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
            <button className = "groupBtn" onClick={() => console.log('Regresar')}>Regresar</button>
                <button className = "groupBtn" onClick={() => console.log('Finalizar')}>Finalizar</button>
            
                <input
                    type="text"
                    placeholder="Ingrese la sede"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className = "groupBtn" onClick={() => console.log('Buscar')}>Buscar</button>
                </div>

        </div>
        <div> <button id = "testbtn" class = "groupBtn" onClick={() =>
            
            addProfessorToFirestore("Juan Pérez", "http://example.com/photo.jpg","San Jose","juan.perez@example.com", "12345678","87654321")
            
            }>Test</button> </div>
            
        </>
    );
};

export default Historial;