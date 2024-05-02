import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IniciarSesion from './pages/IniciarSesion/IniciarSesion';
import { Helmet } from 'react-helmet';
import favicon from './images/faviconTD.ico';
import Fondo from './components/Fondo';
import { AuthProvider } from './contexts/auth';


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
          </Routes>
        </BrowserRouter>
        <Fondo/>
      </AuthProvider>
    </>
  );
}

export default App;
