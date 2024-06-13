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
    nombre: user.nombre,
    apellido1: user.apellido1,
    apellido2: user.apellido2,
    celular: user.celular,
    email: user.email,
    nombre2: user.nombre2,
    sede: user.sede
  });

  //console.log(user);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    console.log(user);

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    const collections = ['Admins', 'Profesores', 'Estudiantes'];
    let userDocRef = null;

    for (const collectionName of collections) {
      const currentCollection = collection(db, collectionName);
      const q = query(currentCollection, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        userDocRef = querySnapshot.docs[0].ref;
        break;
      }
    }

    if (userDocRef) {
      try {
        await updateDoc(userDocRef, profileData);
        console.log('User data updated successfully');
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    } else {
      console.log("No se encontró el documento del usuario en ninguna colección");
    }
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
