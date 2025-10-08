import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Form, Modal, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import './RRHHEmpleados.css';

// Datos simulados
const empleadosIniciales = [
  {
    id: '1001',
    nombre: 'Juan Pérez',
    cedula: '12345678',
    correo: 'juan.perez@empresa.com',
    cargo: 'Analista',
    area: 'Recursos Humanos',
    fechaIngreso: '2022-01-15',
    estado: 'Activo',
    rol: 'Empleado',
  },
  {
    id: '1002',
    nombre: 'Ana Gómez',
    cedula: '87654321',
    correo: 'ana.gomez@empresa.com',
    cargo: 'Supervisor',
    area: 'Operaciones',
    fechaIngreso: '2021-08-10',
    estado: 'Inactivo',
    rol: 'Supervisor',
  },
  {
    id: '1003',
    nombre: 'Carlos Ruiz',
    cedula: '11223344',
    correo: 'carlos.ruiz@empresa.com',
    cargo: 'RRHH',
    area: 'Recursos Humanos',
    fechaIngreso: '2020-05-20',
    estado: 'Activo',
    rol: 'RRHH',
  },
];

const cargos = ['Analista', 'Supervisor', 'RRHH', 'Gerente'];
const areas = ['Recursos Humanos', 'Operaciones', 'Finanzas', 'IT', 'Ventas'];
const roles = ['Empleado', 'Supervisor', 'RRHH', 'Administrador'];
const estados = ['Activo', 'Inactivo', 'Suspendido', 'Baja'];

export default function RRHHEmpleados() {
  const [empleados, setEmpleados] = useState(empleadosIniciales);
  const [filtros, setFiltros] = useState({ texto: '', cargo: '', area: '', estado: '' });
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showDetalle, setShowDetalle] = useState(null);

  // Filtrado
  const empleadosFiltrados = empleados.filter(emp => {
    const texto = filtros.texto.toLowerCase();
    return (
      (emp.nombre.toLowerCase().includes(texto) ||
        emp.id.includes(texto) ||
        emp.cedula.includes(texto)) &&
      (filtros.cargo ? emp.cargo === filtros.cargo : true) &&
      (filtros.area ? emp.area === filtros.area : true) &&
      (filtros.estado ? emp.estado === filtros.estado : true)
    );
  });

  // Handlers de filtros
  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Agregar o editar empleado
  const handleGuardar = (e) => {
    e.preventDefault();
    if (editando.id) {
      setEmpleados(empleados.map(emp => emp.id === editando.id ? editando : emp));
    } else {
      setEmpleados([
        { ...editando, id: Date.now().toString() },
        ...empleados,
      ]);
    }
    setShowModal(false);
    setEditando(null);
  };

  // Cambiar estado
  const handleEstado = (emp, nuevoEstado) => {
    setEmpleados(empleados.map(e =>
      e.id === emp.id ? { ...e, estado: nuevoEstado } : e
    ));
  };

  // Eliminar empleado
  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      setEmpleados(empleados.filter(e => e.id !== id));
    }
  };

  // Exportar a Excel (simulado)
  const handleExportar = () => {
    alert('Función de exportar lista a Excel/PDF lista para backend.');
  };

  // Render
  return (
    <Layout rrhhMenu>
      <div className="rrhh-empleados-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Gestión de Empleados</h2>
          <div>
            <Button variant="success" className="me-2" onClick={() => { setEditando({ nombre: '', cedula: '', correo: '', cargo: '', area: '', fechaIngreso: '', estado: 'Activo', rol: 'Empleado' }); setShowModal(true); }}>
              + Agregar Empleado
            </Button>
            <Button variant="outline-primary" onClick={handleExportar}>
              Exportar Excel/PDF
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Row className="g-2">
              <Col md={3}>
                <Form.Control
                  placeholder="Buscar por nombre, ID o cédula"
                  name="texto"
                  value={filtros.texto}
                  onChange={handleFiltro}
                />
              </Col>
              <Col md={2}>
                <Form.Select name="cargo" value={filtros.cargo} onChange={handleFiltro}>
                  <option value="">Todos los cargos</option>
                  {cargos.map(c => <option key={c}>{c}</option>)}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select name="area" value={filtros.area} onChange={handleFiltro}>
                  <option value="">Todas las áreas</option>
                  {areas.map(a => <option key={a}>{a}</option>)}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select name="estado" value={filtros.estado} onChange={handleFiltro}>
                  <option value="">Todos los estados</option>
                  {estados.map(e => <option key={e}>{e}</option>)}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabla de empleados */}
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cargo</th>
                  <th>Área</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>
                      <Button variant="link" className="p-0" onClick={() => setShowDetalle(emp)}>
                        {emp.nombre}
                      </Button>
                    </td>
                    <td>{emp.cargo}</td>
                    <td>{emp.area}</td>
                    <td>{emp.correo}</td>
                    <td>
                      <Badge bg={
                        emp.estado === 'Activo' ? 'success' :
                        emp.estado === 'Inactivo' ? 'secondary' :
                        emp.estado === 'Suspendido' ? 'warning' : 'danger'
                      }>
                        {emp.estado}
                      </Badge>
                    </td>
                    <td>{emp.rol}</td>
                    <td>
                      <Button size="sm" variant="primary" className="me-1" onClick={() => { setEditando(emp); setShowModal(true); }}>Editar</Button>
                      <Button size="sm" variant="warning" className="me-1" onClick={() => handleEstado(emp, emp.estado === 'Activo' ? 'Inactivo' : 'Activo')}>
                        {emp.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleEliminar(emp.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
                {empleadosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">No se encontraron empleados.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Modal agregar/editar */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editando && editando.id ? 'Editar Empleado' : 'Agregar Empleado'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardar}>
            <Modal.Body>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      required
                      value={editando?.nombre || ''}
                      onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Cédula</Form.Label>
                    <Form.Control
                      required
                      value={editando?.cedula || ''}
                      onChange={e => setEditando({ ...editando, cedula: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      value={editando?.correo || ''}
                      onChange={e => setEditando({ ...editando, correo: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Select
                      required
                      value={editando?.cargo || ''}
                      onChange={e => setEditando({ ...editando, cargo: e.target.value })}
                    >
                      <option value="">Seleccione...</option>
                      {cargos.map(c => <option key={c}>{c}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Área</Form.Label>
                    <Form.Select
                      required
                      value={editando?.area || ''}
                      onChange={e => setEditando({ ...editando, area: e.target.value })}
                    >
                      <option value="">Seleccione...</option>
                      {areas.map(a => <option key={a}>{a}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Fecha de Ingreso</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={editando?.fechaIngreso || ''}
                      onChange={e => setEditando({ ...editando, fechaIngreso: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                      required
                      value={editando?.rol || ''}
                      onChange={e => setEditando({ ...editando, rol: e.target.value })}
                    >
                      <option value="">Seleccione...</option>
                      {roles.map(r => <option key={r}>{r}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      required
                      value={editando?.estado || ''}
                      onChange={e => setEditando({ ...editando, estado: e.target.value })}
                    >
                      {estados.map(e => <option key={e}>{e}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal detalle */}
        <Modal show={!!showDetalle} onHide={() => setShowDetalle(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ficha de Empleado</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showDetalle && (
              <>
                <Row>
                  <Col md={6}><b>Nombre:</b> {showDetalle.nombre}</Col>
                  <Col md={6}><b>Cédula:</b> {showDetalle.cedula}</Col>
                  <Col md={6}><b>Correo:</b> {showDetalle.correo}</Col>
                  <Col md={6}><b>Cargo:</b> {showDetalle.cargo}</Col>
                  <Col md={6}><b>Área:</b> {showDetalle.area}</Col>
                  <Col md={6}><b>Fecha de Ingreso:</b> {showDetalle.fechaIngreso}</Col>
                  <Col md={6}><b>Estado:</b> {showDetalle.estado}</Col>
                  <Col md={6}><b>Rol:</b> {showDetalle.rol}</Col>
                </Row>
                <hr />
                <div className="text-muted">
                  <i>Historial, solicitudes, asistencias, formación, etc. (listo para backend)</i>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
}