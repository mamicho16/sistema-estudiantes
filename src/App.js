import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IniciarSesion from './pages/IniciarSesion/IniciarSesion';
import { Helmet } from 'react-helmet';
import favicon from './images/faviconTD.ico';
import Fondo from './components/Fondo';
import { AuthProvider } from './contexts/auth';
import Inicio from './pages/inicio/inicio';
import Historial from './pages/historial/Historial';
import { ProtectedRoute } from './ProtectedRoute';
import EquipoGuia from './pages/equipoGuia/equipoGuia';
import EdicionGuia from './pages/EdicionGuia/EdicionGuia';
import PlanTrabajoGuia from './pages/PlanTrabajoGuia/PlanTrabajoGuia';
import ListaDeEstudiantes from './pages/ListaDeEstudiantes/ListaDeEstudiantes';
import AgregarActividad from './pages/AgregarActividad/AgregarActividad';
import AgregarProfesor from './pages/AgregarProfesor/AgregarProfesor';
import ListaDeEstudiantesProfesores from './pages/ListaEstudiantesProfesores/ListaEstudiantesProfesores';
import VerEvidencia from './pages/VerEvidencia/VerEvidencia';
import BuzonEntrada from './pages/BuzonEntrada/BuzonEntrada';
import PlanTrabajoCentroAcademico from './pages/PlanTrabajoCentroAcademico/PlanTrabajoCentroAcademico';
import Perfil from './pages/Perfil/perfil';

function App() {
  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} type="image/x-ico" />
      </Helmet>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/iniciarsesion" element={<IniciarSesion />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/equipoGuia" element={<EquipoGuia />} />
            <Route path="/edicionGuia" element={<EdicionGuia />} />
            <Route path="/planTrabajoGuia" element={<PlanTrabajoGuia />} />
            <Route path="/agregarActividad" element={<AgregarActividad />} />
            <Route path="/ListaDeEstudiantes" element={<ListaDeEstudiantes />} />
            <Route path="/ListaDeEstudiantesProfesores" element={<ListaDeEstudiantesProfesores />} />
            <Route path="/agregarProfesor" element={<AgregarProfesor />} />
            <Route path="/planTrabajoCentroAcademico" element={<PlanTrabajoCentroAcademico />} />
            <Route path="/buzonEntrada" element={<BuzonEntrada />} />
            <Route path="/verEvidencia/:activityId" element={<VerEvidencia />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Inicio />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Fondo />
      </AuthProvider>
    </>
  );
}

export default App;
