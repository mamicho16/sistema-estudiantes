import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import './navBar.css';
import { useAuth } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";

const NavBar = ({titulo}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = async () => {
        logout();
        navigate("/iniciarsesion");
    }

    const handleInicio = () => {
        navigate("/inicio");
    }

    return (
        <Navbar bg="light" variant="light" className="navbar">
            <Navbar.Brand className="brand" onClick={handleInicio}>{titulo}</Navbar.Brand >
            <Nav className="nav">
                <Nav.Link onClick={cerrarSesion} style={{color: '#2A67C3'}}> Cerrar sesión</Nav.Link>
            </Nav>
        </Navbar>
    );
}


export default NavBar;