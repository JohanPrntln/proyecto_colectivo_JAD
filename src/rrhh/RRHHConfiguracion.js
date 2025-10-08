import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Row, Col, Table, Modal, Badge, Alert } from 'react-bootstrap';
import './RRHHConfiguracion.css';

// Datos simulados para parámetros y usuarios
const parametrosIniciales = {
  empresa: 'JAD Gestión',
  logo: '',
  colorPrimario: '#1a73e8',
  politicaVacaciones: 15,
  politicaPermisos: 5,
  idioma: 'es',
  zonaHoraria: 'America/Bogota',
};

const usuariosIniciales = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@empresa.com', rol: 'RRHH', estado: 'Activo' },
  { id: 2, nombre: 'Ana Gómez', correo: 'ana@empresa.com', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Carlos Ruiz', correo: 'carlos@empresa.com', rol: 'Empleado', estado: 'Inactivo' },
];

const cargosIniciales = ['Analista', 'Supervisor', 'RRHH', 'Gerente'];
const areasIniciales = ['Recursos Humanos', 'Operaciones', 'Finanzas', 'IT', 'Ventas'];

export default function RRHHConfiguracion() {
  const [parametros, setParametros] = useState(parametrosIniciales);
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [cargos, setCargos] = useState(cargosIniciales);
  const [areas, setAreas] = useState(areasIniciales);
  const [nuevoCargo, setNuevoCargo] = useState('');
  const [nuevoArea, setNuevoArea] = useState('');
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [alerta, setAlerta] = useState(null);

  // Guardar parámetros generales
  const handleGuardarParametros = (e) => {
    e.preventDefault();
    setAlerta({ tipo: 'success', mensaje: 'Parámetros guardados correctamente.' });
    setTimeout(() => setAlerta(null), 2000);
  };

  // Usuarios
  const handleEditarUsuario = (usuario) => {
    setEditandoUsuario(usuario);
    setShowModalUsuario(true);
  };

  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    if (editandoUsuario.id) {
      setUsuarios(usuarios.map(u => u.id === editandoUsuario.id ? editandoUsuario : u));
    } else {
      setUsuarios([{ ...editandoUsuario, id: Date.now() }, ...usuarios]);
    }
    setShowModalUsuario(false);
    setEditandoUsuario(null);
    setAlerta({ tipo: 'success', mensaje: 'Usuario guardado correctamente.' });
    setTimeout(() => setAlerta(null), 2000);
  };

  const handleEliminarUsuario = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  // Cargos y áreas
  const handleAgregarCargo = () => {
    if (nuevoCargo && !cargos.includes(nuevoCargo)) {
      setCargos([...cargos, nuevoCargo]);
      setNuevoCargo('');
    }
  };
  const handleEliminarCargo = (cargo) => setCargos(cargos.filter(c => c !== cargo));

  const handleAgregarArea = () => {
    if (nuevoArea && !areas.includes(nuevoArea)) {
      setAreas([...areas, nuevoArea]);
      setNuevoArea('');
    }
  };
  const handleEliminarArea = (area) => setAreas(areas.filter(a => a !== area));

  // Simulación de integración
  const handleIntegracion = (sistema) => {
    setAlerta({ tipo: 'info', mensaje: `Integración con ${sistema} lista para backend.` });
    setTimeout(() => setAlerta(null), 2000);
  };

  // Simulación de auditoría
  const auditoriaSimulada = [
    { fecha: '2024-05-10', usuario: 'Ana Gómez', accion: 'Editó parámetros generales' },
    { fecha: '2024-05-09', usuario: 'Juan Pérez', accion: 'Agregó usuario' },
    { fecha: '2024-05-08', usuario: 'Carlos Ruiz', accion: 'Eliminó área "Compras"' },
  ];

  // Función exótica: "Modo Innovación"
  const [modoInnovacion, setModoInnovacion] = useState(false);

  return (
    <Layout rrhhMenu>
      <div className="rrhh-configuracion-container">
        <h2 className="mb-4">Configuración General del Sistema</h2>
        {alerta && <Alert variant={alerta.tipo}>{alerta.mensaje}</Alert>}

        {/* Parámetros generales */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Form onSubmit={handleGuardarParametros}>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nombre de la empresa</Form.Label>
                    <Form.Control
                      value={parametros.empresa}
                      onChange={e => setParametros({ ...parametros, empresa: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Color primario</Form.Label>
                    <Form.Control
                      type="color"
                      value={parametros.colorPrimario}
                      onChange={e => setParametros({ ...parametros, colorPrimario: e.target.value })}
                      style={{ width: 60, height: 38, padding: 2 }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Logo</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={e => setParametros({ ...parametros, logo: e.target.files[0]?.name || '' })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Política de vacaciones (días/año)</Form.Label>
                    <Form.Control
                      type="number"
                      value={parametros.politicaVacaciones}
                      onChange={e => setParametros({ ...parametros, politicaVacaciones: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Política de permisos (días/año)</Form.Label>
                    <Form.Control
                      type="number"
                      value={parametros.politicaPermisos}
                      onChange={e => setParametros({ ...parametros, politicaPermisos: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Idioma</Form.Label>
                    <Form.Select
                      value={parametros.idioma}
                      onChange={e => setParametros({ ...parametros, idioma: e.target.value })}
                    >
                      <option value="es">Español</option>
                      <option value="en">Inglés</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Zona horaria</Form.Label>
                    <Form.Select
                      value={parametros.zonaHoraria}
                      onChange={e => setParametros({ ...parametros, zonaHoraria: e.target.value })}
                    >
                      <option value="America/Bogota">Bogotá</option>
                      <option value="America/Mexico_City">CDMX</option>
                      <option value="America/Lima">Lima</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="primary" className="mt-3">Guardar parámetros</Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Gestión de usuarios y roles */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Gestión de Usuarios y Permisos</h5>
              <Button variant="success" onClick={() => { setEditandoUsuario({ nombre: '', correo: '', rol: 'Empleado', estado: 'Activo' }); setShowModalUsuario(true); }}>
                + Agregar Usuario
              </Button>
            </div>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.rol}</td>
                    <td>
                      <Badge bg={u.estado === 'Activo' ? 'success' : 'secondary'}>
                        {u.estado}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="primary" className="me-2" onClick={() => handleEditarUsuario(u)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => handleEliminarUsuario(u.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Parámetros de RRHH */}
        <Row>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5>Cargos</h5>
                <Form className="d-flex mb-2">
                  <Form.Control
                    placeholder="Nuevo cargo"
                    value={nuevoCargo}
                    onChange={e => setNuevoCargo(e.target.value)}
                  />
                  <Button variant="success" className="ms-2" onClick={handleAgregarCargo}>Agregar</Button>
                </Form>
                <ul className="list-group">
                  {cargos.map(c => (
                    <li key={c} className="list-group-item d-flex justify-content-between align-items-center">
                      {c}
                      <Button size="sm" variant="outline-danger" onClick={() => handleEliminarCargo(c)}>Eliminar</Button>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5>Áreas</h5>
                <Form className="d-flex mb-2">
                  <Form.Control
                    placeholder="Nueva área"
                    value={nuevoArea}
                    onChange={e => setNuevoArea(e.target.value)}
                  />
                  <Button variant="success" className="ms-2" onClick={handleAgregarArea}>Agregar</Button>
                </Form>
                <ul className="list-group">
                  {areas.map(a => (
                    <li key={a} className="list-group-item d-flex justify-content-between align-items-center">
                      {a}
                      <Button size="sm" variant="outline-danger" onClick={() => handleEliminarArea(a)}>Eliminar</Button>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Integraciones */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5>Integraciones</h5>
            <Button variant="outline-primary" className="me-2" onClick={() => handleIntegracion('Contabilidad')}>Contabilidad</Button>
            <Button variant="outline-primary" className="me-2" onClick={() => handleIntegracion('Bancos')}>Bancos</Button>
            <Button variant="outline-primary" className="me-2" onClick={() => handleIntegracion('Biometría')}>Biometría</Button>
            <Button variant="outline-primary" onClick={() => handleIntegracion('API/ERP')}>API/ERP</Button>
          </Card.Body>
        </Card>

        {/* Auditoría y Seguridad */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5>Auditoría y Seguridad</h5>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {auditoriaSimulada.map((a, i) => (
                  <tr key={i}>
                    <td>{a.fecha}</td>
                    <td>{a.usuario}</td>
                    <td>{a.accion}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-secondary" className="mt-2">Ver historial completo</Button>
          </Card.Body>
        </Card>

        {/* Función exótica: Modo Innovación */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Modo Innovación 🚀</h5>
              <Form.Check
                type="switch"
                id="modo-innovacion"
                label={modoInnovacion ? 'Activado' : 'Desactivado'}
                checked={modoInnovacion}
                onChange={() => setModoInnovacion(!modoInnovacion)}
              />
            </div>
            {modoInnovacion && (
              <Alert variant="info" className="mt-3">
                <b>¡Modo Innovación activado!</b> Los empleados pueden proponer ideas, votar y RRHH puede gestionar propuestas para la mejora continua de la empresa.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Modal usuario */}
        <Modal show={showModalUsuario} onHide={() => setShowModalUsuario(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editandoUsuario?.id ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardarUsuario}>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  required
                  value={editandoUsuario?.nombre || ''}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={editandoUsuario?.correo || ''}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, correo: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={editandoUsuario?.rol || 'Empleado'}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, rol: e.target.value })}
                >
                  <option>Empleado</option>
                  <option>Supervisor</option>
                  <option>RRHH</option>
                  <option>Administrador</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={editandoUsuario?.estado || 'Activo'}
                  onChange={e => setEditandoUsuario({ ...editandoUsuario, estado: e.target.value })}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModalUsuario(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}