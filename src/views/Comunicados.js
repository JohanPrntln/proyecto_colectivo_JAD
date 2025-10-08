import React, { useState } from 'react';
import './Comunicados.css';

export default function Comunicados() {
  // Datos simulados
  const [comunicados, setComunicados] = useState([
    { id: 1, titulo: 'Nueva Política de Vacaciones', contenido: 'A partir del próximo mes, se implementará una nueva política de vacaciones...', categoria: 'Noticias' },
    { id: 2, titulo: 'Reunión General', contenido: 'Se invita a todos los empleados a la reunión general el próximo viernes...', categoria: 'Mensajes Internos' },
    { id: 3, titulo: 'Encuesta de Satisfacción', contenido: 'Participa en nuestra encuesta de satisfacción para ayudarnos a mejorar...', categoria: 'Encuestas' },
    { id: 4, titulo: 'Permiso de Vacaciones Aprobado', contenido: 'Relaciones Humanas: Su permiso de vacaciones fue otorgado satisfactoriamente. Por favor, revise los detalles en su perfil.', categoria: 'Mensajes Internos' }, // Nuevo mensaje
  ]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const comunicadosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? comunicados
      : comunicados.filter((comunicado) => comunicado.categoria === categoriaSeleccionada);

  return (
    <div className="comunicados-container">
      <div className="menu-lateral">
        <h3>Menú</h3>
        <ul>
          <li onClick={() => handleCategoriaClick('Todos')} className={categoriaSeleccionada === 'Todos' ? 'activo' : ''}>
            Todos
          </li>
          <li onClick={() => handleCategoriaClick('Noticias')} className={categoriaSeleccionada === 'Noticias' ? 'activo' : ''}>
            Noticias
          </li>
          <li onClick={() => handleCategoriaClick('Mensajes Internos')} className={categoriaSeleccionada === 'Mensajes Internos' ? 'activo' : ''}>
            Mensajes Internos
          </li>
          <li onClick={() => handleCategoriaClick('Encuestas')} className={categoriaSeleccionada === 'Encuestas' ? 'activo' : ''}>
            Encuestas
          </li>
          <li>
            <a href="/reglamentos" target="_blank" rel="noopener noreferrer">
              Reglamentos
            </a>
          </li>
        </ul>
      </div>

      <div className="contenido-principal">
        <h1>Comunicados</h1>
        {comunicadosFiltrados.length > 0 ? (
          comunicadosFiltrados.map((comunicado) => (
            <div key={comunicado.id} className="comunicado-item">
              <h3>{comunicado.titulo}</h3>
              <p>{comunicado.contenido}</p>
            </div>
          ))
        ) : (
          <p>No hay comunicados en esta categoría.</p>
        )}
      </div>
    </div>
  );
}