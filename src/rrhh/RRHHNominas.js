import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { listarNominas, generarNomina, eliminarNomina } from '../services/nominaService';
import { listarEmpleados } from '../services/empleadoService';

export default function RRHHNominas() {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState(null);
  const [filtros, setFiltros] = useState({});

  // Estado para el formulario de nueva nómina
  const [formData, setFormData] = useState({
    empleado_id: '',
    periodo_inicio: '',
    periodo_fin: '',
    salario_base: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [nominasData, empleadosData] = await Promise.all([
        listarNominas(filtros),
        listarEmpleados()
      ]);

      setNominas(nominasData);
      setEmpleados(empleadosData);
    } catch (err) {
      setError('Error al cargar los datos. Verifica tu conexión.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarNomina = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const nuevaNomina = await generarNomina(formData);
      setNominas(prev => [nuevaNomina.nomina, ...prev]);
      setShowModal(false);
      setFormData({ empleado_id: '', periodo_inicio: '', periodo_fin: '', salario_base: '' });
      alert('Nómina generada exitosamente');
    } catch (err) {
      alert('Error al generar nómina: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarNomina = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta nómina?')) return;

    try {
      await eliminarNomina(id);
      setNominas(prev => prev.filter(n => n.id !== id));
      alert('Nómina eliminada exitosamente');
    } catch (err) {
      alert('Error al eliminar nómina: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <Layout rrhhMenu>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Gestión de Nóminas</h1>
            <p>Administra las nóminas de los empleados</p>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              Generar Nueva Nómina
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Filtros */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Empleado</Form.Label>
                  <Form.Select
                    value={filtros.empleado_id || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, empleado_id: e.target.value || undefined }))}
                  >
                    <option value="">Todos los empleados</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nombre_completo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.desde || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, desde: e.target.value || undefined }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.hasta || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, hasta: e.target.value || undefined }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => setFiltros({})}
                  className="w-100"
                >
                  Limpiar Filtros
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabla de nóminas */}
        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <p className="mt-2">Cargando nóminas...</p>
              </div>
            ) : nominas.length === 0 ? (
              <div className="text-center py-4">
                <p>No hay nóminas registradas</p>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Período</th>
                    <th>Salario Base</th>
                    <th>Deducciones</th>
                    <th>Total Pagado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {nominas.map(nomina => (
                    <tr key={nomina.id}>
                      <td>{nomina.nombre_completo || 'N/A'}</td>
                      <td>
                        {formatDate(nomina.periodo_inicio)} - {formatDate(nomina.periodo_fin)}
                      </td>
                      <td>{formatCurrency(nomina.salario_base)}</td>
                      <td>{formatCurrency(nomina.deducciones)}</td>
                      <td>
                        <Badge bg="success">{formatCurrency(nomina.total_pagado)}</Badge>
                      </td>
                      <td>{formatDate(nomina.fecha_creacion)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminarNomina(nomina.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modal para generar nómina */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Generar Nueva Nómina</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGenerarNomina}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Empleado *</Form.Label>
                    <Form.Select
                      value={formData.empleado_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, empleado_id: e.target.value }))}
                      required
                    >
                      <option value="">Seleccionar empleado</option>
                      {empleados.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nombre_completo}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salario Base *</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Ej: 2000000"
                      value={formData.salario_base}
                      onChange={(e) => setFormData(prev => ({ ...prev, salario_base: e.target.value }))}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Período Inicio *</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.periodo_inicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodo_inicio: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Período Fin *</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.periodo_fin}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodo_fin: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Alert variant="info">
                <strong>Cálculos automáticos:</strong> Se aplicarán deducciones del 4% para salud y 4% para pensión.
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Generando...' : 'Generar Nómina'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Layout>
  );
}
