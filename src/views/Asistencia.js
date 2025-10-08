import React, { useState } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import './Asistencia.css';

export default function Asistencia() {
  // Datos simulados de asistencia
  const [registros, setRegistros] = useState([
    { fecha: '2025-05-01', entrada: '08:00 AM', salida: '05:00 PM', estado: 'Presente' },
    { fecha: '2025-05-02', entrada: '08:15 AM', salida: '05:00 PM', estado: 'Retraso' },
    { fecha: '2025-05-03', entrada: null, salida: null, estado: 'Ausente' },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [justificacion, setJustificacion] = useState('');

  const handleJustificar = (e) => {
    e.preventDefault();
    alert(`Justificación enviada para el día ${selectedDate.toLocaleDateString()}: ${justificacion}`);
    setJustificacion('');
  };

  return (
    <div className="asistencia-container">
      <h1>Mi Asistencia</h1>

      {/* Tabla de registros */}
      <h2>Registros de Entrada/Salida</h2>
      <table className="asistencia-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td>{registro.fecha}</td>
              <td>{registro.entrada || 'N/A'}</td>
              <td>{registro.salida || 'N/A'}</td>
              <td className={registro.estado === 'Ausente' ? 'estado-ausente' : ''}>
                {registro.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calendario */}
      <h2>Historial de Asistencia</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const registro = registros.find((r) => new Date(r.fecha).toDateString() === date.toDateString());
          if (registro) {
            if (registro.estado === 'Ausente') return 'calendario-ausente';
            if (registro.estado === 'Retraso') return 'calendario-retraso';
            return 'calendario-presente';
          }
          return null;
        }}
      />

      {/* Formulario de justificación */}
      <h2>Justificar Ausencia/Retraso</h2>
      <form className="justificacion-form" onSubmit={handleJustificar}>
        <label>
          Fecha seleccionada: <strong>{selectedDate.toLocaleDateString()}</strong>
        </label>
        <textarea
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          placeholder="Escribe tu justificación aquí..."
          required
        />
        <button type="submit">Enviar Justificación</button>
      </form>
    </div>
  );
}