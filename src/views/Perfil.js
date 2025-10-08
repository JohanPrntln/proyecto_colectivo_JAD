import React, { useState } from 'react';
import './Perfil.css';

export default function Perfil() {
  // Datos simulados del usuario
  const [usuario, setUsuario] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    telefono: '123456789',
    direccion: 'Calle 123, Bogotá, Colombia',
  });

  const [documentos, setDocumentos] = useState([
    { id: 1, nombre: 'Cédula de Ciudadanía.pdf', url: '#' },
    { id: 2, nombre: 'Diploma Universitario.pdf', url: '#' },
  ]);

  const [editando, setEditando] = useState(false);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  const handleEditar = () => setEditando(!editando);

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    alert('Datos personales actualizados');
    setEditando(false);
  };

  const handleSubirDocumento = (e) => {
    e.preventDefault();
    const nuevoDocumento = {
      id: documentos.length + 1,
      nombre: e.target.nombreArchivo.value,
      url: '#',
    };
    setDocumentos([...documentos, nuevoDocumento]);
    alert('Documento subido con éxito');
    e.target.reset();
  };

  const handleCambiarCorreo = (e) => {
    e.preventDefault();
    setUsuario({ ...usuario, correo: nuevoCorreo });
    alert('Correo actualizado con éxito');
    setNuevoCorreo('');
  };

  const handleCambiarContrasena = (e) => {
    e.preventDefault();
    alert('Contraseña actualizada con éxito');
    setNuevaContrasena('');
  };

  return (
    <div className="perfil-container">
      <h1>Mi Perfil</h1>

      {/* Datos personales */}
      <h2>Datos Personales</h2>
      {editando ? (
        <form className="editar-form" onSubmit={handleGuardarCambios}>
          <label>
            Nombre:
            <input
              type="text"
              defaultValue={usuario.nombre}
              onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              defaultValue={usuario.telefono}
              onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
              required
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              defaultValue={usuario.direccion}
              onChange={(e) => setUsuario({ ...usuario, direccion: e.target.value })}
              required
            />
          </label>
          <button type="submit">Guardar Cambios</button>
        </form>
      ) : (
        <div className="datos-personales">
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          <p><strong>Dirección:</strong> {usuario.direccion}</p>
          <button onClick={handleEditar}>Editar Datos</button>
        </div>
      )}

      {/* Documentos personales */}
      <h2>Documentos Personales</h2>
      <ul className="documentos-lista">
        {documentos.map((doc) => (
          <li key={doc.id}>
            <a href={doc.url} download>{doc.nombre}</a>
          </li>
        ))}
      </ul>
      <form className="subir-documento-form" onSubmit={handleSubirDocumento}>
        <label>
          Nombre del archivo:
          <input type="text" name="nombreArchivo" required />
        </label>
        <button type="submit">Subir Documento</button>
      </form>

      {/* Cambiar correo */}
      <h2>Cambiar Correo</h2>
      <form className="cambiar-form" onSubmit={handleCambiarCorreo}>
        <label>
          Nuevo Correo:
          <input
            type="email"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            required
          />
        </label>
        <button type="submit">Actualizar Correo</button>
      </form>

      {/* Cambiar contraseña */}
      <h2>Cambiar Contraseña</h2>
      <form className="cambiar-form" onSubmit={handleCambiarContrasena}>
        <label>
          Nueva Contraseña:
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />
        </label>
        <button type="submit">Actualizar Contraseña</button>
      </form>
    </div>
  );
}