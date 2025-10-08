import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Table, Modal, InputGroup } from 'react-bootstrap';
import './RRHHAnuncios.css';

const anunciosIniciales = [
  { id: 1, mensaje: 'Reunión general el viernes a las 10:00 AM.', destinatario: 'Todos', fecha: '2024-05-10' },
  { id: 2, mensaje: 'Nuevo protocolo de seguridad implementado.', destinatario: 'Todos', fecha: '2024-05-09' },
  { id: 3, mensaje: 'Felicitaciones a Juan Pérez por su desempeño.', destinatario: '12345', fecha: '2024-05-08' },
];

export default function RRHHAnuncios() {
  const [anuncios, setAnuncios] = useState(anunciosIniciales);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ mensaje: '', tipoDestinatario: 'Todos', idDestinatario: '' });
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoAnuncio({ ...nuevoAnuncio, [name]: value });
  };

  const handleCrear = (e) => {
    e.preventDefault();
    if (!nuevoAnuncio.mensaje.trim()) return;
    const destinatario = nuevoAnuncio.tipoDestinatario === 'Todos'
      ? 'Todos'
      : nuevoAnuncio.idDestinatario.trim();
    setAnuncios([
      { mensaje: nuevoAnuncio.mensaje, destinatario, id: Date.now(), fecha: new Date().toISOString().slice(0, 10) },
      ...anuncios,
    ]);
    setNuevoAnuncio({ mensaje: '', tipoDestinatario: 'Todos', idDestinatario: '' });
  };

  const handleEditar = (anuncio) => {
    setEditando({
      ...anuncio,
      tipoDestinatario: anuncio.destinatario === 'Todos' ? 'Todos' : 'ID',
      idDestinatario: anuncio.destinatario === 'Todos' ? '' : anuncio.destinatario,
    });
    setShowModal(true);
  };

  const handleGuardarEdicion = () => {
    const destinatario = editando.tipoDestinatario === 'Todos'
      ? 'Todos'
      : editando.idDestinatario.trim();
    setAnuncios(anuncios.map(a =>
      a.id === editando.id
        ? { ...editando, destinatario }
        : a
    ));
    setShowModal(false);
    setEditando(null);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este anuncio?')) {
      setAnuncios(anuncios.filter(a => a.id !== id));
    }
  };

  return (
    <Layout rrhhMenu>
      <div className="rrhh-anuncios-container">
        <h2 className="mb-4">Gestión de Anuncios</h2>
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Form onSubmit={handleCrear}>
              <Form.Group className="mb-2">
                <Form.Label>Mensaje del anuncio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="mensaje"
                  value={nuevoAnuncio.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe el anuncio..."
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Destinatario</Form.Label>
                <InputGroup>
                  <Form.Select
                    name="tipoDestinatario"
                    value={nuevoAnuncio.tipoDestinatario}
                    onChange={handleChange}
                  >
                    <option value="Todos">Todos los empleados</option>
                    <option value="ID">Por ID de empleado</option>
                  </Form.Select>
                  {nuevoAnuncio.tipoDestinatario === 'ID' && (
                    <Form.Control
                      type="text"
                      name="idDestinatario"
                      placeholder="ID del empleado"
                      value={nuevoAnuncio.idDestinatario}
                      onChange={handleChange}
                      required
                    />
                  )}
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="success">Publicar anuncio</Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <h5>Anuncios publicados</h5>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Mensaje</th>
                  <th>Destinatario</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {anuncios.map(anuncio => (
                  <tr key={anuncio.id}>
                    <td>{anuncio.mensaje}</td>
                    <td>{anuncio.destinatario === 'Todos' ? 'Todos' : `ID: ${anuncio.destinatario}`}</td>
                    <td>{anuncio.fecha}</td>
                    <td>
                      <Button size="sm" variant="primary" className="me-2" onClick={() => handleEditar(anuncio)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => handleEliminar(anuncio.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
                {anuncios.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">No hay anuncios publicados.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Modal para editar anuncio */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Anuncio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editando && (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editando.mensaje}
                    onChange={e => setEditando({ ...editando, mensaje: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Destinatario</Form.Label>
                  <InputGroup>
                    <Form.Select
                      name="tipoDestinatario"
                      value={editando.tipoDestinatario}
                      onChange={e => setEditando({ ...editando, tipoDestinatario: e.target.value })}
                    >
                      <option value="Todos">Todos los empleados</option>
                      <option value="ID">Por ID de empleado</option>
                    </Form.Select>
                    {editando.tipoDestinatario === 'ID' && (
                      <Form.Control
                        type="text"
                        name="idDestinatario"
                        placeholder="ID del empleado"
                        value={editando.idDestinatario}
                        onChange={e => setEditando({ ...editando, idDestinatario: e.target.value })}
                        required
                      />
                    )}
                  </InputGroup>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarEdicion}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}