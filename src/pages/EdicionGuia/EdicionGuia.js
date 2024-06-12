import React from "react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import UserCard from "../../components/UserCard/UserCard";
import userP from "../../images/userPhoto.jpg";
import "./EdicionGuia.css";
import { useNavigate } from "react-router-dom";
import { getProfessors, updateProfessor, darBaja } from "../../contexts/profesor";
import EditProfessorModal from "../../components/EditProfesor/EditProfesor";
import { useLocation } from "react-router-dom";


const EdicionGuia = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetchAndConvertProfessors();
    }, [location]); // Empty dependency array to run only once on component mount

    const fetchAndConvertProfessors = async () => {
        try {
            const professors = await getProfessors();
            const activeProfessors = professors.filter(professor => professor.estado === true);
            const usersData = activeProfessors.map(professor => ({
                name: professor.nombre +" "+ professor.nombre2 +" "+ professor.apellido1 +" "+ professor.apellido2,
                imageUrl: professor.foto,
                location: professor.sede + " ",
                code: professor.codigo, // Adjust if professor data structure has a Codigo property
                email: professor.email,
                officeNumber: professor.numOficina,
                cellNumber: professor.celular,
                estado: professor.estado,
                coordinador: professor.coordinador
            }));
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching professors: ", error);
        }
    };

    const handleAgregarProf = () => {
        navigate("/agregarProfesor");
    };

const handleEdit = (user) => {
    console.log("Editing user:", user);
    setEditingUser(user);
};

const handleCloseModal = () => {
    setEditingUser(null);
};

const handleSaveChanges = async (code, updatedData) => {
    await updateProfessor(code, updatedData);
    fetchAndConvertProfessors();
};

const handleBaja = async (user) => {
    await darBaja(user.code);
    fetchAndConvertProfessors();
};

    return (
        <>
            <NavBar titulo="Equipo Guía" id/>
            <Helmet>
                <title>Equipo Guía - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="subtituloH">
                <h1>Docentes Asignados</h1>
                <button className="add-button" onClick={handleAgregarProf}>+</button>
            </div>
            <div className="card-container">
                {users.map(user => (
                    <div className="user-card-wrapper" key={user.email} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <UserCard user={user} />
                        <div className="pag-buttons">
                            <button type="button" onClick={() => handleEdit(user)}>Editar</button>
                            <button type="button" onClick={() => handleBaja(user)}>Baja</button>
                        </div>
                    </div>
                ))}
            </div>
            {editingUser && (
                <EditProfessorModal
                    professor={editingUser}
                    onClose={handleCloseModal}
                    onSave={handleSaveChanges}
                />
            )}
        </>
    );
};

export default EdicionGuia;