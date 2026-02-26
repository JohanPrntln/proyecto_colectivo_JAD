import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Row, Col, Badge, Alert, Spinner } from 'react-bootstrap';
import solicitudService from '../services/solicitudService';
import './RRHHSolicitudes.css';

export default function RRHHSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensajes, setMensajes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await solicitudService.listarSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al cargar las solicitudes. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMensaje = (id, value) => {
    setMensajes({ ...mensajes, [id]: value });
  };

  const handleAccion = async (id, accion) => {
    try {
      setError('');
      setSuccess('');

      const estado = accion === 'aceptar' ? 'aprobado' : 'rechazado';
      const remunerado = mensajes[id] || null; // Usar mensajes como remunerado por ahora

      await solicitudService.actualizarEstado(id, estado, remunerado);

      // Actualizar el estado local
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                estado: estado.charAt(0).toUpperCase() + estado.slice(1),
                remunerado: remunerado,
                fecha_revision: new Date().toISOString(),
              }
            : s
        )
      );

      setMensajes((prev) => ({ ...prev, [id]: '' }));
      setSuccess(`Solicitud ${accion === 'aceptar' ? 'aprobada' : 'rechazada'} exitosamente.`);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      setError('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <Layout rrhhMenu>
        <div className="rrhh-solicitudes-container text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando solicitudes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout rrhhMenu>
      <div className="rrhh-solicitudes-container">
        <h2 className="mb-4">Gestión de Solicitudes de Empleados</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

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
                      <Badge bg={
                        solicitud.estado === 'pendiente' ? 'warning' :
                        solicitud.estado === 'aprobado' ? 'success' : 'danger'
                      }>
                        {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                      </Badge>
                      <span className="ms-2">{solicitud.tipo.charAt(0).toUpperCase() + solicitud.tipo.slice(1)}</span>
                    </h5>
                    <p className="mb-1"><b>Empleado:</b> {solicitud.nombre_completo}</p>
                    <p className="mb-1"><b>Área:</b> {solicitud.area}</p>
                    <p className="mb-1"><b>Fecha inicio:</b> {new Date(solicitud.fecha_inicio).toLocaleDateString()}</p>
                    <p className="mb-1"><b>Fecha fin:</b> {new Date(solicitud.fecha_fin).toLocaleDateString()}</p>
                    <p className="mb-1"><b>Días solicitados:</b> {solicitud.dias_solicitados}</p>
                    <p className="mb-2"><b>Motivo:</b> {solicitud.motivo}</p>
                    {solicitud.fecha_revision && (
                      <p className="mb-1"><b>Revisado por:</b> {solicitud.revisado_por_correo || 'Sistema'}</p>
                    )}
                  </Col>
                  <Col md={4} className="d-flex flex-column justify-content-between">
                    {solicitud.estado === 'pendiente' ? (
                      <>
                        <Form.Group className="mb-2">
                          <Form.Control
                            as="select"
                            value={mensajes[solicitud.id] || ''}
                            onChange={(e) => handleChangeMensaje(solicitud.id, e.target.value)}
                          >
                            <option value="">Seleccionar remunerado</option>
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                          </Form.Control>
                        </Form.Group>
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleAccion(solicitud.id, 'aceptar')}
                          >
                            Aprobar
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
                        <p className="mb-1"><b>Remunerado:</b> {solicitud.remunerado ? 'Sí' : 'No'}</p>
                        {solicitud.fecha_revision && (
                          <p className="mt-2 mb-0 text-muted small">
                            Revisado el {new Date(solicitud.fecha_revision).toLocaleDateString()}
                          </p>
                        )}
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
