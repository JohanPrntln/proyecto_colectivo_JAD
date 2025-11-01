import React, { useState, useEffect } from 'react';
import './Solicitudes.css';
import solicitudService from '../services/solicitudService';

export default function Solicitudes() {
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [formData, setFormData] = useState({
    tipo: '',
    fecha_inicio: '',
    fecha_fin: '',
    dias_solicitados: '',
    motivo: '',
    soporte: null,
  });
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Cargar solicitudes del empleado al montar el componente
  useEffect(() => {
    cargarMisSolicitudes();
  }, []);

  const cargarMisSolicitudes = async () => {
    try {
      const data = await solicitudService.listarMisSolicitudes();
      setMisSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const handleTipoChange = (tipo) => {
    setTipoSolicitud(tipo);
    setFormData({
      ...formData,
      tipo: tipo,
      fecha_inicio: '',
      fecha_fin: '',
      dias_solicitados: '',
      motivo: '',
      soporte: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calcular días automáticamente si se cambian fechas
    if (name === 'fecha_inicio' || name === 'fecha_fin') {
      const inicio = name === 'fecha_inicio' ? value : formData.fecha_inicio;
      const fin = name === 'fecha_fin' ? value : formData.fecha_fin;
      if (inicio && fin) {
        const dias = Math.ceil((new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24)) + 1;
        setFormData(prev => ({ ...prev, dias_solicitados: dias > 0 ? dias : '' }));
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, soporte: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('fecha_inicio', formData.fecha_inicio);
      formDataToSend.append('fecha_fin', formData.fecha_fin);
      formDataToSend.append('dias_solicitados', formData.dias_solicitados);
      formDataToSend.append('motivo', formData.motivo);
      if (formData.soporte) {
        formDataToSend.append('soporte', formData.soporte);
      }

      await solicitudService.crearSolicitud(formDataToSend);
      setMensaje('¡Solicitud enviada exitosamente!');
      setTipoSolicitud('');
      setFormData({
        tipo: '',
        fecha_inicio: '',
        fecha_fin: '',
        dias_solicitados: '',
        motivo: '',
        soporte: null,
      });
      cargarMisSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const tiposSolicitud = [
    { value: 'vacaciones', label: 'Vacaciones' },
    { value: 'permiso', label: 'Permiso' },
    { value: 'licencia', label: 'Licencia' },
    { value: 'trabajo_remoto', label: 'Trabajo Remoto' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="solicitudes-container">
      <h1>Solicitudes</h1>

      {/* Selector de tipo de solicitud */}
      {!tipoSolicitud ? (
        <div className="tipo-selector">
          <h3>¿Qué tipo de solicitud deseas hacer?</h3>
          <div className="tipos-grid">
            {tiposSolicitud.map((tipo) => (
              <button
                key={tipo.value}
                className="tipo-button"
                onClick={() => handleTipoChange(tipo.value)}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Formulario */}
          <div className="form-header">
            <h3>Solicitud de {tiposSolicitud.find(t => t.value === tipoSolicitud)?.label}</h3>
            <button
              className="back-button"
              onClick={() => setTipoSolicitud('')}
            >
              ← Cambiar tipo
            </button>
          </div>

          {mensaje && (
            <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
              {mensaje}
            </div>
          )}

          <form className="solicitudes-form" onSubmit={handleSubmit}>
            {/* Fechas */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha_inicio">Fecha de inicio:</label>
                <input
                  type="date"
                  id="fecha_inicio"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fecha_fin">Fecha de fin:</label>
                <input
                  type="date"
                  id="fecha_fin"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Días solicitados */}
            <div className="form-group">
              <label htmlFor="dias_solicitados">Días solicitados:</label>
              <input
                type="number"
                id="dias_solicitados"
                name="dias_solicitados"
                value={formData.dias_solicitados}
                onChange={handleChange}
                placeholder="Se calcula automáticamente"
                readOnly
              />
            </div>

            {/* Motivo */}
            <div className="form-group">
              <label htmlFor="motivo">Motivo o descripción:</label>
              <textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="Describe el motivo de tu solicitud..."
                required
              />
            </div>

            {/* Archivo */}
            <div className="form-group">
              <label htmlFor="soporte">Subir documento de soporte (opcional):</label>
              <input
                type="file"
                id="soporte"
                name="soporte"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
              />
            </div>

            {/* Botón de envío */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </>
      )}

      {/* Lista de solicitudes */}
      <div className="solicitudes-lista">
        <h3>Mis Solicitudes</h3>
        {misSolicitudes.length === 0 ? (
          <p className="no-solicitudes">No tienes solicitudes registradas.</p>
        ) : (
          <div className="solicitudes-grid">
            {misSolicitudes.map((solicitud) => (
              <div key={solicitud.id} className={`solicitud-card estado-${solicitud.estado.toLowerCase()}`}>
                <div className="solicitud-header">
                  <span className="tipo">{solicitud.tipo}</span>
                  <span className={`estado ${solicitud.estado.toLowerCase()}`}>
                    {solicitud.estado}
                  </span>
                </div>
                <div className="solicitud-body">
                  <p><strong>Fecha inicio:</strong> {new Date(solicitud.fecha_inicio).toLocaleDateString()}</p>
                  <p><strong>Fecha fin:</strong> {new Date(solicitud.fecha_fin).toLocaleDateString()}</p>
                  <p><strong>Días:</strong> {solicitud.dias_solicitados}</p>
                  <p><strong>Motivo:</strong> {solicitud.motivo}</p>
                  {solicitud.fecha_revision && (
                    <p><strong>Revisado:</strong> {new Date(solicitud.fecha_revision).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
