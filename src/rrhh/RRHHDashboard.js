import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function RRHHDashboard() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <Layout rrhhMenu>
      <Container>
        <h1 className="mb-4">Panel de Recursos Humanos</h1>
        <Row className="mt-4">
          {/* Solicitudes pendientes */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Solicitudes Pendientes</Card.Title>
                <Card.Text>
                  Revisa y gestiona las solicitudes de los empleados.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/rrhh/solicitudes'}
                >
                  Ver
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Chats pendientes */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Chats Pendientes</Card.Title>
                <Card.Text>
                  Responde a los mensajes enviados por los empleados.
                </Card.Text>
                <Button
                  variant="info"
                  onClick={() => window.location.href = '/rrhh/chats'}
                >
                  Ver
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Gestión de anuncios */}
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Gestión de Anuncios</Card.Title>
                <Card.Text>
                  Crea y publica anuncios para los empleados.
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => window.location.href = '/rrhh/anuncios'}
                >
                  Ver
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}