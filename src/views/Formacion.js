import React, { useState } from 'react';
import './Formacion.css';

export default function Formacion() {
  // Datos simulados de cursos y certificados
  const [cursos, setCursos] = useState([
    { id: 1, nombre: 'Introducción a la Gestión Empresarial', progreso: 80, completado: false },
    { id: 2, nombre: 'Técnicas Avanzadas de Ventas', progreso: 100, completado: true },
    { id: 3, nombre: 'Liderazgo y Trabajo en Equipo', progreso: 50, completado: false },
  ]);

  const certificados = [
    { id: 1, nombre: 'Constancia Laboral', tipo: 'Laboral' },
    { id: 2, nombre: 'Certificado de Experiencia', tipo: 'Experiencia' },
    { id: 3, nombre: 'Certificado de Empresa', tipo: 'Empresa' },
  ];

  const handleDescargarCertificado = (nombre) => {
    alert(`Descargando ${nombre}...`);
    // Aquí puedes implementar la lógica para generar y descargar el certificado
  };

  return (
    <div className="formacion-container">
      <h1>Mi Formación</h1>

      {/* Cursos asignados */}
      <h2>Cursos Asignados</h2>
      <div className="cursos-lista">
        {cursos.map((curso) => (
          <div key={curso.id} className="curso-item">
            <h3>{curso.nombre}</h3>
            <div className="progreso-container">
              <div
                className="progreso-barra"
                style={{ width: `${curso.progreso}%` }}
              ></div>
            </div>
            <p>Progreso: {curso.progreso}%</p>
            {curso.completado && (
              <button
                className="descargar-btn"
                onClick={() => handleDescargarCertificado(curso.nombre)}
              >
                Descargar Certificado
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Certificados laborales */}
      <h2>Certificados Laborales</h2>
      <div className="certificados-lista">
        {certificados.map((certificado) => (
          <div key={certificado.id} className="certificado-item">
            <h3>{certificado.nombre}</h3>
            <button
              className="descargar-btn"
              onClick={() => handleDescargarCertificado(certificado.nombre)}
            >
              Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}