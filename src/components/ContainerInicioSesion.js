import styled from 'styled-components';

const ContainerInicioSesion = styled.div`
background: #fff;
width: 50%;
max-width: 70rem; /* 1110px */
height: 50vh;
max-height: 50rem;  /* 800px */
box-shadow: 0px 1.25rem 2.5rem rgba(0,0,0,.05);
border-radius: 2rem; /* 10px */
margin: 25vh auto 0 auto; /* Margen superior variable para evitar pegarse arriba */
display: flex;
flex-direction: column;
justify-content: space-between; /* Centra el contenido verticalmente dentro del contenedor */
position: relative;
z-index: 100;

@media(max-width: 60rem){ /* 950px */
    height: 95vh;
    max-height: none;
    margin-top: 2.5vh; /* Margen superior ajustado para mantener el contenedor centrado verticalmente */
}
`;

export default ContainerInicioSesion;