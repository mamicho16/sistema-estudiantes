import React, { useState } from "react";
import './forgotpassword.css';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Se ha enviado un correo para restablecer la contraseña");
            navigate('/iniciarSesion');
        } catch (error) {
            alert("No se pudo enviar el correo de restablecimiento");
            console.error("Error en resetPassword:", error);
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h1>Recuperar contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={email} 
                        onChange={handleChange} 
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
