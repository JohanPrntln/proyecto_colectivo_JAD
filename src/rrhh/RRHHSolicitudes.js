import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import './RRHHSolicitudes.css';

const solicitudesIniciales = [
  {
    id: 1,
    empleado: 'Juan Pérez',
    motivo: 'Vacaciones',
    detalle: 'Solicito vacaciones del 10 al 20 de junio.',
    estado: 'Pendiente',
    mensaje: '',
  },
  {
    id: 2,
    empleado: 'Ana Gómez',
    motivo: 'Permiso médico',
    detalle: 'Permiso por cita médica el 15 de mayo.',
    estado: 'Pendiente',
    mensaje: '',
  },
  {
    id: 3,
    empleado: 'Carlos Ruiz',
    motivo: 'Trabajo remoto',
    detalle: 'Solicito trabajar remoto el viernes.',
    estado: 'Pendiente',
    mensaje: '',
  },
];

export default function RRHHSolicitudes() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [mensajes, setMensajes] = useState({});

  const handleChangeMensaje = (id, value) => {
    setMensajes({ ...mensajes, [id]: value });
  };

  const handleAccion = (id, accion) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: accion === 'aceptar' ? 'Aprobada' : 'Rechazada',
              mensaje: mensajes[id] || '',
            }
          : s
      )
    );
    setMensajes((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <Layout rrhhMenu>
      <div className="rrhh-solicitudes-container">
        <h2 className="mb-4">Gestión de Solicitudes de Empleados</h2>
        {solicitudes.length === 0 ? (
          <Card className="mb-3">
            <Card.Body>
              <p className="text-center text-muted">No hay solicitudes pendientes.</p>
            </Card.Body>
          </Card>
        ) : (
          solicitudes.map((solicitud) => (
            <Card className="mb-4 shadow-sm solicitud-card" key={solicitud.id}>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h5>
                      <Badge bg={solicitud.estado === 'Pendiente' ? 'warning' : solicitud.estado === 'Aprobada' ? 'success' : 'danger'}>
                        {solicitud.estado}
                      </Badge>{' '}
                      <span className="ms-2">{solicitud.motivo}</span>
                    </h5>
                    <p className="mb-1"><b>Empleado:</b> {solicitud.empleado}</p>
                    <p className="mb-2"><b>Detalle:</b> {solicitud.detalle}</p>
                  </Col>
                  <Col md={4} className="d-flex flex-column justify-content-between">
                    {solicitud.estado === 'Pendiente' ? (
                      <>
                        <Form.Group className="mb-2">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Escribe un mensaje para el empleado (opcional)..."
                            value={mensajes[solicitud.id] || ''}
                            onChange={(e) => handleChangeMensaje(solicitud.id, e.target.value)}
                          />
                        </Form.Group>
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleAccion(solicitud.id, 'aceptar')}
                          >
                            Aceptar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleAccion(solicitud.id, 'rechazar')}
                          >
                            Rechazar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="mb-1"><b>Mensaje enviado:</b></p>
                        <div className="mensaje-enviado">{solicitud.mensaje || <span className="text-muted">Sin mensaje</span>}</div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}