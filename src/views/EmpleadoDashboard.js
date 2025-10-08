import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faCalendarAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import ChatBox from './ChatBox';

export default function EmpleadoDashboard() {
  const [showChat, setShowChat] = useState(false);

  const handleChatToggle = () => setShowChat(!showChat);

  return (
    <div className="main-content">
      <Container>
        <Row className="mt-5 pt-5">
          {/* Tarjeta de Chat */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faComments} /> Chat con RRHH
                </Card.Title>
                <Card.Text>
                  ¿Tienes dudas o necesitas ayuda? Habla con alguien de Relaciones Humanas.
                </Card.Text>
                <Button variant="primary" onClick={handleChatToggle}>
                  {showChat ? 'Cerrar Chat' : 'Iniciar Chat'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* Tarjeta de Calendario */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Mi Calendario
                </Card.Title>
                <Card.Text>
                  Consulta tus eventos y días importantes.
                </Card.Text>
                <Button variant="info">Ver Calendario</Button>
              </Card.Body>
            </Card>
          </Col>
          {/* Tarjeta de Tareas */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon={faTasks} /> Mis Tareas
                </Card.Title>
                <Card.Text>
                  Revisa y completa tus tareas asignadas.
                </Card.Text>
                <Button variant="success">Ir a Tareas</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          {/* Tablón de Anuncios */}
          <Col md={12}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Tablón de Anuncios</Card.Title>
                <Card.Text>
                  <ul>
                    <li>Reunión general el viernes a las 10:00 AM.</li>
                    <li>Nuevo protocolo de seguridad implementado.</li>
                    <li>Capacitación en liderazgo el lunes.</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Chat desplegable */}
      {showChat && <ChatBox onClose={handleChatToggle} />}
    </div>
  );
}