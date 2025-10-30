import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Table, Form, Modal, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import './RRHHEmpleados.css';
import { listarEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from '../services/empleadoService';

// Quitar datos simulados, usar backend
const cargos = ['Analista', 'Supervisor', 'RRHH', 'Gerente'];
const areas = ['Recursos Humanos', 'Operaciones', 'Finanzas', 'IT', 'Ventas'];
const estados = ['Activo', 'Inactivo', 'Suspendido', 'Baja'];

export default function RRHHEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [filtros, setFiltros] = useState({ texto: '', cargo: '', area: '', estado: '' });
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showDetalle, setShowDetalle] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar empleados del backend
  useEffect(() => {
    cargarEmpleados();
  }, []);

  async function cargarEmpleados() {
    setLoading(true);
    try {
      const list = await listarEmpleados();
      setEmpleados(list);
    } catch (err) {
      console.error('Error al cargar empleados', err);
    } finally {
      setLoading(false);
    }
  }

  // Filtrado
  const empleadosFiltrados = empleados.filter(emp => {
    const texto = filtros.texto.toLowerCase();
    return (
      (emp.nombre_completo?.toLowerCase().includes(texto) ||
        emp.id?.toString().includes(texto) ||
        emp.documento?.includes(texto)) &&
      (filtros.cargo ? emp.cargo === filtros.cargo : true) &&
      (filtros.area ? emp.area === filtros.area : true) &&
      (filtros.estado ? emp.estado === filtros.estado : true)
    );
  });

  // Handlers de filtros
  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Agregar o editar empleado via backend
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!editando) return;
    setLoading(true);
    try {
      const payload = {
        nombre_completo: editando.nombre,
        documento: editando.cedula,
        cargo: editando.cargo,
        area: editando.area,
        fecha_ingreso: editando.fechaIngreso,
        estado: editando.estado
      };
      if (editando.id) {
        await actualizarEmpleado(editando.id, payload);
      } else {
        await crearEmpleado(payload);
      }
      await cargarEmpleados(); // Recargar lista
      setShowModal(false);
      setEditando(null);
    } catch (err) {
      console.error('Error al guardar empleado', err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar empleado via backend
  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      try {
        await eliminarEmpleado(id);
        await cargarEmpleados();
      } catch (err) {
        console.error('Error al eliminar', err);
      }
    }
  };

  // Render (quitar datos simulados, usar empleados del state)
  return (
    <Layout rrhhMenu>
      <div className="rrhh-empleados-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Gestión de Empleados</h2>
          <div>
            <Button variant="success" className="me-2" onClick={() => { setEditando({ nombre: '', cedula: '', correo: '', cargo: '', area: '', fechaIngreso: '', estado: 'Activo' }); setShowModal(true); }}>
              + Agregar Empleado
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Row className="g-2">
              <Col md={3}>
                <Form.Control
                  placeholder="Buscar por nombre, ID o documento"
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

        {/* Tabla */}
        <Card className="shadow-sm">
          <Card.Body>
            {loading ? <p>Cargando...</p> : (
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
                          {emp.nombre_completo}
                        </Button>
                      </td>
                      <td>{emp.cargo}</td>
                      <td>{emp.area}</td>
                      <td>{emp.correo}</td>
                      <td>
                        <Badge bg={emp.estado === 'activo' ? 'success' : 'secondary'}>
                          {emp.estado}
                        </Badge>
                      </td>
                      <td>{emp.rol}</td>
                      <td>
                        <Button size="sm" variant="primary" className="me-1" onClick={() => { setEditando({ id: emp.id, nombre: emp.nombre_completo, cedula: emp.documento, cargo: emp.cargo, area: emp.area, fechaIngreso: emp.fecha_ingreso, estado: emp.estado }); setShowModal(true); }}>Editar</Button>
                        <Button size="sm" variant="danger" onClick={() => handleEliminar(emp.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                  {empleadosFiltrados.length === 0 && <tr><td colSpan={8} className="text-center text-muted">No se encontraron empleados.</td></tr>}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modal agregar/editar (quitar campo rol, mapear nombres) */}
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
                    <Form.Control required value={editando?.nombre || ''} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control required value={editando?.cedula || ''} onChange={e => setEditando({ ...editando, cedula: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Select required value={editando?.cargo || ''} onChange={e => setEditando({ ...editando, cargo: e.target.value })}>
                      <option value="">Seleccione...</option>
                      {cargos.map(c => <option key={c}>{c}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Área</Form.Label>
                    <Form.Select required value={editando?.area || ''} onChange={e => setEditando({ ...editando, area: e.target.value })}>
                      <option value="">Seleccione...</option>
                      {areas.map(a => <option key={a}>{a}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Fecha de Ingreso</Form.Label>
                    <Form.Control type="date" required value={editando?.fechaIngreso || ''} onChange={e => setEditando({ ...editando, fechaIngreso: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select required value={editando?.estado || 'activo'} onChange={e => setEditando({ ...editando, estado: e.target.value })}>
                      {estados.map(e => <option key={e} value={e.toLowerCase()}>{e}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
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
                  <Col md={6}><b>Nombre:</b> {showDetalle.nombre_completo}</Col>
                  <Col md={6}><b>Documento:</b> {showDetalle.documento}</Col>
                  <Col md={6}><b>Correo:</b> {showDetalle.correo}</Col>
                  <Col md={6}><b>Cargo:</b> {showDetalle.cargo}</Col>
                  <Col md={6}><b>Área:</b> {showDetalle.area}</Col>
                  <Col md={6}><b>Fecha de Ingreso:</b> {showDetalle.fecha_ingreso}</Col>
                  <Col md={6}><b>Estado:</b> {showDetalle.estado}</Col>
                  <Col md={6}><b>Rol:</b> {showDetalle.rol}</Col>
                </Row>
                <hr />
                <div className="text-muted"><i>Historial, solicitudes, asistencias, formación, etc. (listo para backend)</i></div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
}
