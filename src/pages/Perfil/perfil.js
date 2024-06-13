import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { useAuth } from "../../contexts/auth";
import './perfil.css';
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

const Perfil = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    celular: "",
    email: "",
    nombre2: "",
    sede: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || "",
        apellido1: user.apellido1 || "",
        apellido2: user.apellido2 || "",
        celular: user.celular || "",
        email: user.email || "",
        nombre2: user.nombre2 || "",
        sede: user.sede || ""
      });
    }
  }, [user]);

  const updateUserDataInFirestore = async () => {
    //updateUserData(profileData);
  };

  const handleSave = async () => {
    // Aquí puedes realizar alguna validación si es necesario antes de guardar
    try{
      await updateUserDataInFirestore();
    } catch(error){

    }

    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <NavBar titulo="Inicio" id="navBar" />
      <Helmet>
        <title>Plan de Trabajo - Tecnológico de Costa Rica</title>
      </Helmet>
      <div className="user-profile">
        <h1 style={{ color: 'black' }}>Perfil del Usuario</h1>
        <div className="profile-info">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={profileData.nombre}
            onChange={handleChange}
          />
          <label>Primer Apellido:</label>
          <input
            type="text"
            name="apellido1"
            value={profileData.apellido1}
            onChange={handleChange}
          />
          <label>Segundo Apellido:</label>
          <input
            type="text"
            name="apellido2"
            value={profileData.apellido2}
            onChange={handleChange}
          />
          <label>Número de teléfono:</label>
          <input
            type="text"
            name="celular"
            value={profileData.celular}
            onChange={handleChange}
          />
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div className="profile-actions">
          <button onClick={handleSave}>Guardar Cambios</button>
        </div>
      </div>
    </>
  );
};

export default Perfil;
