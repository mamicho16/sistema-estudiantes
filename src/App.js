import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IniciarSesion from './pages/IniciarSesion/IniciarSesion';
import { Helmet } from 'react-helmet';
import favicon from './images/faviconTD.ico';
import Fondo from './components/Fondo';
import { AuthProvider } from './contexts/auth';
import Inicio from './pages/inicio/inicio';
import InicioProfesor from './pages/inicioProfesor/inicioProfesor';
import Historial from './pages/historial/Historial';
import { ProtectedRoute } from './ProtectedRoute';


function App() {
  return (
    <>
      <Helmet>
        <link rel = "shortcut icon" href = {favicon} type = "image/x-ico"/>
      </Helmet>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/iniciarsesion" element={<IniciarSesion/>} />
            <Route path="/iniciarsesion" element={<IniciarSesion/>} />
            <Route path="/historial" element={<Historial/>} />
            <Route path="/inicioProfesor" element={<InicioProfesor/>} /> 
            <Route path="/inicio" element={<Inicio/>} /> 
            <Route  element={<ProtectedRoute/>}>
              <Route path="/" element={<Inicio/>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Fondo/>
      </AuthProvider>
    </>
  );
}

export default App;
