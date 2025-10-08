import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Modal, Form, Container, Nav, Navbar, NavDropdown, Carousel } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Principal() {
  // Estados para los modales y usuarios registrados
  const [showRegistro, setShowRegistro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios registrados
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Manejo de modales
  const handleRegistroClose = () => setShowRegistro(false);
  const handleRegistroShow = () => setShowRegistro(true);

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  // Manejo del formulario de registro
  const handleRegistroSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const nuevoUsuario = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
    };
    setUsuarios([...usuarios, nuevoUsuario]); // Guardar el nuevo usuario
    alert('Usuario registrado con éxito');
    setShowRegistro(false);
  };

  // Manejo del formulario de inicio de sesión
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email === loginData.email && usuario.password === loginData.password
    );
    if (usuarioEncontrado) {
      alert(`Bienvenido, ${usuarioEncontrado.nombre}`);
      navigate('/login'); // Redirigir a la página de Login
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div>
      {/* Barra de navegación */}
      <Row>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#home" className="d-flex align-items-center">
              <img src="/logo_jad.png" alt="Logo JAD" style={{ height: "280px", width: "auto", marginRight: "10px" }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#features">Características</Nav.Link>
                <Nav.Link href="#pricing">Precios</Nav.Link>
                <NavDropdown title="Menú" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Opción 1</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Opción 2</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Opción 3</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Nav.Link onClick={handleRegistroShow}>Registrarse</Nav.Link>
                <Nav.Link onClick={handleLoginShow}>Acceder</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>

      {/* Modal de Registro */}
      <Modal show={showRegistro} onHide={handleRegistroClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registrarse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegistroSubmit}>
            <Form.Group className="mb-3" controlId="formRegistroNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="nombre" placeholder="Ingresa tu nombre" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRegistroEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" name="email" placeholder="Ingresa tu correo" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRegistroPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="password" placeholder="Ingresa tu contraseña" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Registrarse
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Acceso (Login) */}
      <Modal show={showLogin} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Acceder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="formLoginEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingresa tu correo"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLoginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Iniciar sesión
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Contenido principal */}
      <Row>
        <Col md={6} className="text-section">
          <h1>🚀 Transformando el Futuro Empresarial</h1>
          <p className="description">
            Nuestro objetivo es reducir la carga operativa de las empresas.
            JAD te permite enfocarte en lo que realmente importa: hacer crecer tu negocio,
            atender mejor a tus clientes y trabajar con tranquilidad.
          </p>
          <Row className="cta-section text-center">
            <Col>
              <h2>¿Listo para optimizar tu empresa?</h2>
              <p>Prueba nuestro software y lleva tu negocio al siguiente nivel.</p>
              <Button className="custom-button" size="lg">
                Digitaliza tu empresa aquí <span className="arrow">→</span>
              </Button>
            </Col>
          </Row>
        </Col>
        {/* Carrusel de imágenes */}
        <Col md={6}>
          <div className="carousel-container">
            <Carousel controls={true} indicators={true} interval={3000} className="custom-carousel">
              <Carousel.Item>
                <img src="/imagen1.svg" alt="Primera imagen" className="d-block w-100" />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  src="/imagen2.png"
                  alt="Segunda imagen"
                  className="d-block w-100"
                  style={{ objectFit: 'contain', height: '400px' }}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img src="/imagen3.svg" alt="Tercera imagen" className="d-block w-100" />
              </Carousel.Item>
            </Carousel>
          </div>
        </Col>
      </Row>

      {/* Beneficios */}
      <Row className="benefits-section">
        <Col md={4} className="text-center">
          <img src="/icon1.png" alt="Beneficio 1" className="benefit-icon" />
          <h4>Automatización</h4>
          <p>Automatiza tareas repetitivas y ahorra tiempo.</p>
        </Col>
        <Col md={4} className="text-center">
          <img src="/icono2.jpg" alt="Beneficio 2" className="benefit-icon" />
          <h4>Optimización</h4>
          <p>Optimiza procesos para mejorar la productividad.</p>
        </Col>
        <Col md={4} className="text-center">
          <img src="/icono3.png" alt="Beneficio 3" className="benefit-icon" style={{ width: "230px", height: "230px" }} />
          <h4>Gestión Centralizada</h4>
          <p>Gestiona todo desde una sola plataforma.</p>
        </Col>
      </Row>

      {/* Testimonios */}
      <Row className="testimonials-section">
        <Col md={4} className="text-center">
          <blockquote>
            <p>"Este software ha transformado nuestra forma de trabajar."</p>
            <footer>- Juan Pérez, Gerente de Recursos Humanos</footer>
          </blockquote>
        </Col>
        <Col md={4} className="text-center">
          <blockquote>
            <p>"La automatización nos ha ahorrado horas de trabajo."</p>
            <footer>- María López, Directora de Operaciones</footer>
          </blockquote>
        </Col>
        <Col md={4} className="text-center">
          <blockquote>
            <p>"Una herramienta imprescindible para cualquier empresa."</p>
            <footer>- Carlos Gómez, CEO</footer>
          </blockquote>
        </Col>
      </Row>
    </div>
  );
}
