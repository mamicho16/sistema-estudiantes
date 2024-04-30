import styled from "styled-components";

const Fondo = styled.div`
    background-color: #518CFF; // Color de fondo azul
    height: 100vh; // Altura completa de la vista
    width: 100vw; // Ancho completo de la vista
    position: fixed; // Posicionamiento fijo respecto a la ventana del navegador
    top: 0; // Inicio en la parte superior de la ventana
    left: 0; // Inicio en la parte izquierda de la ventana
    z-index: -1; // Establecer el índice Z negativo para enviar al fondo
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Fondo;
