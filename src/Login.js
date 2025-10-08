import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faCalendarAlt, faTasks, faFileAlt, faClipboardList, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function CustomNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Has cerrado sesión exitosamente.');
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div className="login-container">
      {/* Barra de navegación superior */}
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
              <Nav.Link as={Link} to="/solicitudes">Solicitudes</Nav.Link>
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

      {/* Menú lateral fijo */}
      <div className="menu-lateral">
        <ul className="menu-list">
          <li>
            <Link to="/solicitudes">
              <FontAwesomeIcon icon={faClipboardList} /> Solicitudes
            </Link>
          </li>
          <li>
            <Link to="/nomina">
              <FontAwesomeIcon icon={faFileAlt} /> Mi Nómina
            </Link>
          </li>
          <li>
            <Link to="/asistencia">
              <FontAwesomeIcon icon={faCalendarAlt} /> Mi Asistencia
            </Link>
          </li>
          <li>
            <Link to="/formacion">
              <FontAwesomeIcon icon={faChartLine} /> Mi Formación
            </Link>
          </li>
          <li>
            <Link to="/perfil">
              <FontAwesomeIcon icon={faUser} /> Mi Perfil
            </Link>
          </li>
          <li>
            <Link to="/comunicados">
              <FontAwesomeIcon icon={faBell} /> Comunicados
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}