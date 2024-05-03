import React from "react";
import { useAuth } from "../../contexts/auth";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";

const Inicio = () => {
    const { user } = useAuth();
    console.log(user);
    return (
        <>
        <Helmet>
            <title>Inicio</title>
        </Helmet>
            <div>
                <NavBar titulo = "Inicio"/>
                <h1>Hola {user.nombre}</h1>
            </div>
        </>
    );
}

export default Inicio;