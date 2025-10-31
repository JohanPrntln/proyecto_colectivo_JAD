import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Row, Col, Table, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import './RRHHConfiguracion.css';
import { crearUsuario as apiCrearUsuario, listarUsuarios as apiListarUsuarios } from '../services/usuarioService';

/*
  RRHHConfiguracion mejorado:
  - Llama al backend para crear usuario + empleado.
  - Actualiza la lista local de usuarios desde backend.
  - Maneja loading, errores y mensajes.
  - Campos del modal adaptados al payload que espera el backend.
*/

// Roles mapeados a los role_id de la BD
const ROLES_MAP = {
  'Administrador': 1,
  'Jefe': 2,
  'Empleado': 3,
  'RRHH': 2 // si quieres tratarlos como Jefe o Admin ajusta aquí
};

export default function RRHHConfiguracion() {
  // parámetros UI (simulada)
  const [parametros, setParametros] = useState({
    empresa: 'JAD Gestión',
    logo: '',
    colorPrimario: '#1a73e8',
    politicaVacaciones: 15,
    politicaPermisos: 5,
    idioma: 'es',
    zonaHoraria: 'America/Bogota',
  });

  // usuarios ahora vendrán del backend
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState(['Analista', 'Supervisor', 'RRHH', 'Gerente']);
  const [areas, setAreas] = useState(['Recursos Humanos', 'Operaciones', 'Finanzas', 'IT', 'Ventas']);

  const [nuevoCargo, setNuevoCargo] = useState('');
  const [nuevoArea, setNuevoArea] = useState('');
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [loadingLista, setLoadingLista] = useState(false);
  const [saving, setSaving] = useState(false);

  // carga inicial de usuarios desde backend
  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    setLoadingLista(true);
    try {
      const list = await apiListarUsuarios(); // espera arreglo [{id, correo, nombre_completo, rol_nombre, estado}, ...]
      setUsuarios(list);
    } catch (err) {
      console.error('Error al listar usuarios', err);
      setAlerta({ tipo: 'danger', mensaje: 'No se pudo cargar la lista de usuarios.' });
      setTimeout(() => setAlerta(null), 3000);
    } finally {
      setLoadingLista(false);
    }
  }

  // Guardar parámetros generales (local, simulado)
  const handleGuardarParametros = (e) => {
    e.preventDefault();
    setAlerta({ tipo: 'success', mensaje: 'Parámetros guardados correctamente.' });
    setTimeout(() => setAlerta(null), 2000);
  };

  // Abrir modal para añadir
  const handleAbrirAgregar = () => {
    setEditandoUsuario({
      correo: '', contrasena: '', role_id: ROLES_MAP['Empleado'],
      nombre_completo: '', documento: '', cargo: '', area: '', fecha_ingreso: '', estado: 'activo'
    });
    setShowModalUsuario(true);
  };

  const handleEditarUsuario = (usuario) => {
    // transforma si tu objeto usuario tiene campos diferentes
    setEditandoUsuario({
      correo: usuario.correo,
      contrasena: '',
      role_id: ROLES_MAP[usuario.rol] || ROLES_MAP['Empleado'],
      nombre_completo: usuario.nombre_completo || usuario.nombre || '',
      documento: usuario.documento || '',
      cargo: usuario.cargo || '',
      area: usuario.area || '',
      fecha_ingreso: usuario.fecha_ingreso || '',
      estado: (usuario.estado || 'activo').toLowerCase()
    });
    setShowModalUsuario(true);
  };

  // Guardar usuario: llama al backend que crea usuario + empleado (transacción)
  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    if (!editandoUsuario) return;
    setSaving(true);
    setAlerta(null);
    try {
      // Validaciones básicas
      if (!editandoUsuario.correo || !editandoUsuario.contrasena || !editandoUsuario.nombre_completo || !editandoUsuario.documento) {
        setAlerta({ tipo: 'danger', mensaje: 'Completa correo, contraseña, nombre y documento.' });
        setSaving(false);
        return;
      }

      // Prepara payload tal como el backend espera
      const payload = {
        correo: editandoUsuario.correo,
        contrasena: editandoUsuario.contrasena,
        role_id: editandoUsuario.role_id,
        nombre_completo: editandoUsuario.nombre_completo,
        documento: editandoUsuario.documento,
        cargo: editandoUsuario.cargo,
        area: editandoUsuario.area,
        fecha_ingreso: editandoUsuario.fecha_ingreso || null,
        estado: editandoUsuario.estado || 'activo'
      };

      const res = await apiCrearUsuario(payload); // llama al servicio
      // esperar que devuelva { mensaje, usuario_id, empleado_id } o similar
      setAlerta({ tipo: 'success', mensaje: res.mensaje || 'Usuario creado correctamente.' });
      setShowModalUsuario(false);
      setEditandoUsuario(null);
      // recargar lista
      await cargarUsuarios();
    } catch (err) {
      console.error('Error al crear usuario', err);
      // err puede venir con { mensaje } o structure del axios
      const texto = err?.mensaje || err?.response?.data?.mensaje || err?.message || 'Error al crear usuario';
      setAlerta({ tipo: 'danger', mensaje: texto });
    } finally {
      setSaving(false);
      setTimeout(() => setAlerta(null), 4000);
    }
  };

  const handleEliminarUsuario = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      // Aquí podrías llamar a backend para eliminar/desactivar
      setUsuarios(usuarios.filter(u => u.id !== id));
      setAlerta({ tipo: 'success', mensaje: 'Usuario eliminado localmente (implementar backend).' });
      setTimeout(() => setAlerta(null), 2000);
    }
  };

  // Cargos y áreas (mantener local por ahora)
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

  // Simulación de auditoría
  const auditoriaSimulada = [
    { fecha: '2024-05-10', usuario: 'Ana Gómez', accion: 'Editó parámetros generales' },
    { fecha: '2024-05-09', usuario: 'Juan Pérez', accion: 'Agregó usuario' },
    { fecha: '2024-05-08', usuario: 'Carlos Ruiz', accion: 'Eliminó área "Compras"' },
  ];

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
                {/* ... otros campos ... */}
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
              <Button variant="success" onClick={handleAbrirAgregar}>
                + Agregar Usuario
              </Button>
            </div>

            {loadingLista ? (
              <div className="text-center p-3"><Spinner animation="border" /></div>
            ) : (
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
                      <td>{u.nombre_completo || u.nombre || ''}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol_nombre || u.rol || 'Empleado'}</td>
                      <td>
                        <Badge bg={(u.estado || 'activo').toLowerCase() === 'activo' ? 'success' : 'secondary'}>
                          {(u.estado || 'activo').toString()}
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
            )}
          </Card.Body>
        </Card>

        {/* Cargos y áreas */}
        <Row>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5>Cargos</h5>
                <Form className="d-flex mb-2">
                  <Form.Control placeholder="Nuevo cargo" value={nuevoCargo} onChange={e => setNuevoCargo(e.target.value)} />
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
                  <Form.Control placeholder="Nueva área" value={nuevoArea} onChange={e => setNuevoArea(e.target.value)} />
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
            <Button variant="outline-primary" className="me-2">Contabilidad</Button>
            <Button variant="outline-primary" className="me-2">Bancos</Button>
            <Button variant="outline-primary" className="me-2">Biometría</Button>
            <Button variant="outline-primary">API/ERP</Button>
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

        {/* Modo Innovación */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h5>Modo Innovación 🚀</h5>
              <Form.Check type="switch" id="modo-innovacion" label={modoInnovacion ? 'Activado' : 'Desactivado'} checked={modoInnovacion} onChange={() => setModoInnovacion(!modoInnovacion)} />
            </div>
            {modoInnovacion && (
              <Alert variant="info" className="mt-3">
                <b>¡Modo Innovación activado!</b> Los empleados pueden proponer ideas, votar y RRHH puede gestionar propuestas.
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
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control required value={editandoUsuario?.nombre_completo || editandoUsuario?.nombre || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, nombre_completo: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Documento</Form.Label>
                <Form.Control required value={editandoUsuario?.documento || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, documento: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Correo</Form.Label>
                <Form.Control required type="email" value={editandoUsuario?.correo || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, correo: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control required type="password" value={editandoUsuario?.contrasena || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, contrasena: e.target.value })} />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select value={editandoUsuario?.role_id || ROLES_MAP['Empleado']} onChange={e => setEditandoUsuario({ ...editandoUsuario, role_id: Number(e.target.value) })}>
                      <option value={ROLES_MAP['Empleado']}>Empleado</option>
                      <option value={ROLES_MAP['Jefe']}>Jefe</option>
                      <option value={ROLES_MAP['RRHH']}>RRHH</option>
                      <option value={ROLES_MAP['Administrador']}>Administrador</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Select value={editandoUsuario?.cargo || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, cargo: e.target.value })}>
                      <option value="">-- Seleccionar --</option>
                      {cargos.map(c => <option key={c} value={c}>{c}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Área</Form.Label>
                    <Form.Select value={editandoUsuario?.area || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, area: e.target.value })}>
                      <option value="">-- Seleccionar --</option>
                      {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label>Fecha ingreso</Form.Label>
                    <Form.Control type="date" value={editandoUsuario?.fecha_ingreso || ''} onChange={e => setEditandoUsuario({ ...editandoUsuario, fecha_ingreso: e.target.value })} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={editandoUsuario?.estado || 'activo'} onChange={e => setEditandoUsuario({ ...editandoUsuario, estado: e.target.value })}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModalUsuario(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}
