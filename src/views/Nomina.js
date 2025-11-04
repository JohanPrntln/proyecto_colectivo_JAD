import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import { listarMisNominas } from '../services/nominaService';
import './Nomina.css';

export default function Nomina() {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarMisNominas();
  }, []);

  const cargarMisNominas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarMisNominas();
      setNominas(data);
    } catch (err) {
      setError('Error al cargar tus nóminas. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
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

  // Si no hay nóminas, mostrar mensaje informativo
  if (loading) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Cargando tus nóminas...</p>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container className="py-4">
          <Alert variant="danger">{error}</Alert>
          <button
            className="btn btn-primary"
            onClick={cargarMisNominas}
          >
            Reintentar
          </button>
        </Container>
      </Layout>
    );
  }

  if (nominas.length === 0) {
    return (
      <Layout>
        <Container className="py-4">
          <h1>Mis Nóminas</h1>
          <Alert variant="info">
            <h5>No tienes nóminas registradas aún</h5>
            <p>Cuando RRHH genere tu nómina, aparecerá aquí automáticamente.</p>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-4">
        <h1>Mis Nóminas</h1>
        <p>Historial de tus nóminas generadas</p>

        <Row>
          {nominas.map(nomina => (
            <Col md={6} key={nomina.id} className="mb-4">
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      Período: {formatDate(nomina.periodo_inicio)} - {formatDate(nomina.periodo_fin)}
                    </h5>
                    <Badge bg="success">Pagada</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Salario Base:</strong></td>
                        <td className="text-end">{formatCurrency(nomina.salario_base)}</td>
                      </tr>
                      <tr className="table-secondary">
                        <td><strong>Deducciones:</strong></td>
                        <td className="text-end text-danger">-{formatCurrency(nomina.deducciones)}</td>
                      </tr>
                      <tr>
                        <td><strong>Salud (4%):</strong></td>
                        <td className="text-end text-danger">-{formatCurrency(nomina.salario_base * 0.04)}</td>
                      </tr>
                      <tr>
                        <td><strong>Pensión (4%):</strong></td>
                        <td className="text-end text-danger">-{formatCurrency(nomina.salario_base * 0.04)}</td>
                      </tr>
                      <tr className="table-success">
                        <td><strong>Total Pagado:</strong></td>
                        <td className="text-end fw-bold">{formatCurrency(nomina.total_pagado)}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <small className="text-muted">
                    Generada el {formatDate(nomina.fecha_creacion)}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
}
