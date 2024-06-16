import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { useAuth } from "../../contexts/auth";
import './perfil.css';
import { updateUserData } from "../../contexts/excel";
import { db, storage } from "../../firebase/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Perfil = () => {
  const { user, actualizarUser } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [profileData, setProfileData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    celular: "",
    email: "",
    nombre2: "",
    sede: "",
    foto: ""
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
        sede: user.sede || "",
        foto: user.foto || "",
        uid: user.uid,
        password: user.password,
        estudiante: user.estudiante
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Aquí puedes realizar alguna validación si es necesario antes de guardar
    try {
      let updatedProfileData = { ...profileData };

      // Si hay una nueva foto, primero subimos la foto a Firebase Storage
      if (profileData.foto && profileData.fotoFile) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, profileData.fotoFile);
        const photoURL = await getDownloadURL(photoRef);
        updatedProfileData.foto = photoURL;
      }

      await updateUserData(updatedProfileData);
      console.log("Datos del usuario actualizados:", updatedProfileData);
      actualizarUser(updatedProfileData.uid);
      setShowSuccessModal(true);
      console.log(user);
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevState) => ({
          ...prevState,
          foto: reader.result,
          fotoFile: file // Guardamos el archivo para subirlo después
        }));
      };
      reader.readAsDataURL(file);
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
        <div className="profile-photo-container">
          {profileData.foto && <img src={profileData.foto} alt="Foto de perfil" className="profile-photo" />}
        </div>
        <div className="profile-info">
          <label>Nombre:</label>
          <span>{profileData.nombre}</span>
          <label>Primer Apellido:</label>
          <span>{profileData.apellido1}</span>
          <label>Segundo Apellido:</label>
          <span>{profileData.apellido2}</span>
          <label>Número de teléfono:</label>
          <input
            type="text"
            name="celular"
            value={profileData.celular}
            onChange={handleChange}
          />
          <label>Email:</label>
          <span>{profileData.email}</span>
          <label>Sede:</label>
          <span>{profileData.sede}</span>
          <label>Foto:</label>
          <input
            type="file"
            name="foto"
            onChange={handleFileChange}
          />
        </div>
        <div className="profile-actions">
          <button onClick={handleSave}>Guardar Cambios</button>
        </div>
      </div>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <div className="alert alert-success" role="alert">
              Se guardaron los cambios. La página se actualizará en breve.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Perfil;
