import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './Login'; // Solo barra y menú lateral
import Principal from './Principal';
import Solicitudes from './views/Solicitudes';
import Nomina from './views/Nomina';
import Asistencia from './views/Asistencia';
import Formacion from './views/Formacion';
import Perfil from './views/Perfil';
import Comunicados from './views/Comunicados';
import EmpleadoDashboard from './views/EmpleadoDashboard';


// Importa las vistas de RRHH
import RRHHDashboard from './rrhh/RRHHDashboard';
import RRHHSolicitudes from './rrhh/RRHHSolicitudes';
import RRHHChats from './rrhh/RRHHChats';
import RRHHAnuncios from './rrhh/RRHHAnuncios';
import RRHHGestionEmpleados from './rrhh/RRHHGestionEmpleados';
import RRHHReportes from './rrhh/RRHHReportes';
import RRHHConfiguracion from './rrhh/RRHHConfiguracion';
// ...otras vistas RRHH

// Componente para renderizar la barra de navegación condicionalmente
function NavbarWrapper() {
  const location = useLocation();
  return location.pathname !== '/' ? <CustomNavbar /> : null;
}

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<EmpleadoDashboard />} /> {/* Dashboard del empleado */}
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/nomina" element={<Nomina />} />
        <Route path="/asistencia" element={<Asistencia />} />
        <Route path="/formacion" element={<Formacion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/comunicados" element={<Comunicados />} />

        {/* Rutas exclusivas para RRHH */}
        <Route path="/rrhh" element={<RRHHDashboard />} />
        <Route path="/rrhh/solicitudes" element={<RRHHSolicitudes />} />
        <Route path="/rrhh/chats" element={<RRHHChats />} />
        <Route path="/rrhh/anuncios" element={<RRHHAnuncios />} />
        <Route path="/rrhh/empleados" element={<RRHHGestionEmpleados />} />
        <Route path="/rrhh/reportes" element={<RRHHReportes />} />
        <Route path="/rrhh/configuracion" element={<RRHHConfiguracion />} />


        {/* ...más rutas RRHH */}
      </Routes>
    </Router>
  );
}

export default App;