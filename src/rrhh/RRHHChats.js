import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, ListGroup, Badge, InputGroup } from 'react-bootstrap';
import './RRHHChats.css';

// Datos simulados de chats
const chatsSimulados = [
  {
    id: 1,
    empleado: 'Juan Pérez',
    estado: 'Pendiente',
    mensajes: [
      { remitente: 'empleado', texto: 'Hola, tengo una duda sobre mis vacaciones.', fecha: '2024-05-10 09:00' },
      { remitente: 'rrhh', texto: '¡Hola Juan! ¿En qué puedo ayudarte?', fecha: '2024-05-10 09:05' },
      { remitente: 'empleado', texto: '¿Cuántos días me quedan disponibles?', fecha: '2024-05-10 09:06' },
    ],
  },
  {
    id: 2,
    empleado: 'Ana Gómez',
    estado: 'Pendiente',
    mensajes: [
      { remitente: 'empleado', texto: 'Buenos días, ¿puedo cambiar mi turno este viernes?', fecha: '2024-05-11 10:15' },
    ],
  },
  {
    id: 3,
    empleado: 'Carlos Ruiz',
    estado: 'Resuelto',
    mensajes: [
      { remitente: 'empleado', texto: '¿Cuándo se paga la nómina este mes?', fecha: '2024-05-09 08:30' },
      { remitente: 'rrhh', texto: 'El pago será el 15 de mayo.', fecha: '2024-05-09 08:35' },
      { remitente: 'empleado', texto: '¡Gracias!', fecha: '2024-05-09 08:36' },
    ],
  },
];

export default function RRHHChats() {
  const [chats, setChats] = useState(chatsSimulados);
  const [chatSeleccionado, setChatSeleccionado] = useState(chats[0]);
  const [mensaje, setMensaje] = useState('');

  const handleSeleccionarChat = (chat) => {
    setChatSeleccionado(chat);
    setMensaje('');
  };

  const handleEnviarMensaje = () => {
    if (!mensaje.trim()) return;
    const nuevoMensaje = {
      remitente: 'rrhh',
      texto: mensaje,
      fecha: new Date().toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, day: '2-digit', month: '2-digit', year: '2-digit' }),
    };
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chatSeleccionado.id
          ? { ...c, mensajes: [...c.mensajes, nuevoMensaje] }
          : c
      )
    );
    setChatSeleccionado((prev) => ({
      ...prev,
      mensajes: [...prev.mensajes, nuevoMensaje],
    }));
    setMensaje('');
  };

  const handleMarcarResuelto = () => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chatSeleccionado.id
          ? { ...c, estado: 'Resuelto' }
          : c
      )
    );
    setChatSeleccionado((prev) => ({
      ...prev,
      estado: 'Resuelto',
    }));
  };

  return (
    <Layout rrhhMenu>
      <div className="rrhh-chats-panel">
        {/* Panel izquierdo: lista de chats */}
        <div className="chats-list">
          <h4 className="mb-3">Chats de Empleados</h4>
          <ListGroup variant="flush">
            {chats.map((chat) => (
              <ListGroup.Item
                key={chat.id}
                action
                active={chatSeleccionado.id === chat.id}
                onClick={() => handleSeleccionarChat(chat)}
                className="chat-list-item"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <b>{chat.empleado}</b>
                    <Badge
                      bg={chat.estado === 'Pendiente' ? 'warning' : 'success'}
                      text={chat.estado === 'Pendiente' ? 'dark' : 'light'}
                      className="ms-2"
                    >
                      {chat.estado}
                    </Badge>
                  </span>
                  <span className="ultimo-mensaje">
                    {chat.mensajes[chat.mensajes.length - 1]?.texto.slice(0, 20)}...
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Panel derecho: conversación */}
        <div className="chat-conversacion">
          <Card className="shadow-sm chat-card">
            <Card.Body>
              <h5 className="mb-3">
                Conversación con <span className="text-primary">{chatSeleccionado.empleado}</span>
                <Badge
                  bg={chatSeleccionado.estado === 'Pendiente' ? 'warning' : 'success'}
                  text={chatSeleccionado.estado === 'Pendiente' ? 'dark' : 'light'}
                  className="ms-2"
                >
                  {chatSeleccionado.estado}
                </Badge>
              </h5>
              <div className="conversacion-mensajes">
                {chatSeleccionado.mensajes.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mensaje-chat ${msg.remitente === 'rrhh' ? 'mensaje-rrhh' : 'mensaje-empleado'}`}
                  >
                    <div className="mensaje-texto">{msg.texto}</div>
                    <div className="mensaje-fecha">{msg.fecha}</div>
                  </div>
                ))}
              </div>
              {chatSeleccionado.estado === 'Pendiente' && (
                <>
                  <InputGroup className="mt-3">
                    <Form.Control
                      as="textarea"
                      rows={1}
                      placeholder="Escribe tu respuesta..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEnviarMensaje()}
                    />
                    <Button variant="primary" onClick={handleEnviarMensaje}>
                      Enviar
                    </Button>
                  </InputGroup>
                  <Button
                    variant="success"
                    className="mt-2 float-end"
                    onClick={handleMarcarResuelto}
                  >
                    Marcar como resuelto
                  </Button>
                </>
              )}
              {chatSeleccionado.estado === 'Resuelto' && (
                <div className="text-success mt-3">
                  <b>Este chat ha sido marcado como resuelto.</b>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
}