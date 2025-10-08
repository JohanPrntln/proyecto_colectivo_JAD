import React, { useState } from 'react';
import './Solicitudes.css';

export default function Solicitudes() {
  const [formData, setFormData] = useState({
    motivo: '',
    fecha: '',
    archivo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, archivo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud enviada:', formData);
    alert('Tu solicitud ha sido enviada con éxito.');
    setFormData({ motivo: '', fecha: '', archivo: null });
  };

  return (
    <div className="solicitudes-container">
      <h1>Solicitudes</h1>
      <p>Por favor, completa el formulario para enviar tu solicitud.</p>
      <form className="solicitudes-form" onSubmit={handleSubmit}>
        {/* Motivo */}
        <div className="form-group">
          <label htmlFor="motivo">Motivo de la solicitud:</label>
          <textarea
            id="motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Escribe el motivo de tu solicitud..."
            required
          />
        </div>

        {/* Fecha */}
        <div className="form-group">
          <label htmlFor="fecha">Fecha requerida:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        {/* Archivo */}
        <div className="form-group">
          <label htmlFor="archivo">Subir certificado o documento (opcional):</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
          />
        </div>

        {/* Botón de envío */}
        <button type="submit" className="submit-button">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}