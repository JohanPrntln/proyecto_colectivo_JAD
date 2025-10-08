import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children, rrhhMenu }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Has cerrado sesión exitosamente.');
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="shadow-sm navbar fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/login" className="navbar-brand">
            <img
              src="/logo_jad.png"
              alt="Logo"
              style={{ height: '50px', marginRight: '20px' }}
            />
            JAD Gestión
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto navbar-nav">
              <Nav.Link as={Link} to="/login">Inicio</Nav.Link>
            </Nav>
            <Nav className="navbar-actions">
              <Nav.Link href="#notificaciones">
                <FontAwesomeIcon icon={faBell} /> Notificaciones
              </Nav.Link>
              <Nav.Link as={Link} to="/perfil">
                <FontAwesomeIcon icon={faUser} /> Perfil
              </Nav.Link>
              <Button variant="outline-danger" className="ms-2" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Menú lateral */}
      <div className="menu-lateral">
        <ul className="menu-list">
          {rrhhMenu ? (
            <>
              <li><Link to="/rrhh">Dashboard RRHH</Link></li>
              <li><Link to="/rrhh/solicitudes">Solicitudes</Link></li>
              <li><Link to="/rrhh/chats">Chats</Link></li>
              <li><Link to="/rrhh/anuncios">Anuncios</Link></li>
              <li><Link to="/rrhh/empleados">Gestión de Empleados</Link></li>
              <li><Link to="/rrhh/reportes">Reportes</Link></li>
              <li><Link to="/rrhh/configuracion">Configuración</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/solicitudes">Solicitudes</Link></li>
              <li><Link to="/nomina">Mi Nómina</Link></li>
              <li><Link to="/asistencia">Mi Asistencia</Link></li>
              <li><Link to="/formacion">Mi Formación</Link></li>
              <li><Link to="/perfil">Mi Perfil</Link></li>
              <li><Link to="/comunicados">Comunicados</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Contenido dinámico */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}