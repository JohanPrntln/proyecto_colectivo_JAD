import React, { useState } from 'react';
import './ChatBox.css';

export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState([]); // Estado para los mensajes
  const [input, setInput] = useState(''); // Estado para el mensaje actual

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]); // Agregar mensaje del usuario
      setInput(''); // Limpiar el input
      // Simular respuesta automática
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Gracias por tu mensaje. RRHH responderá pronto.', sender: 'bot' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h5>Chat con RRHH</h5>
        <button onClick={onClose} className="close-chat">X</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
}