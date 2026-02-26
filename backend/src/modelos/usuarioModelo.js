// ==========================
// MODELO DE USUARIOS
// ==========================
// Se encarga de interactuar con la base de datos MySQL para operaciones de usuarios.
// Incluye autenticación, registro y gestión de usuarios.

const { pool } = require("../config/db"); // Importa el pool de conexiones MySQL
const bcrypt = require("bcryptjs"); // Librería para hashear contraseñas

// Buscar usuario por correo para login
async function buscarPorCorreo(correo) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
  return rows[0]; // Retorna el usuario o undefined si no existe
}

// Crear nuevo usuario (registro)
async function crearUsuario(datos) {
  const { correo, password, role_id, empleado_id } = datos;
  const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña

  const [resultado] = await pool.query(
    "INSERT INTO usuarios (correo, password, role_id, empleado_id) VALUES (?, ?, ?, ?)",
    [correo, hashedPassword, role_id, empleado_id]
  );
  return resultado.insertId; // Retorna el ID del nuevo usuario
}

// Verificar contraseña durante login
async function verificarPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword); // Retorna true si coincide
}

// Obtener todos los usuarios (para admin)
async function obtenerUsuarios() {
  const [rows] = await pool.query(`
    SELECT u.id, u.correo, u.role_id, e.nombre_completo, e.area
    FROM usuarios u
    LEFT JOIN empleados e ON u.empleado_id = e.id
    ORDER BY u.id
  `);
  return rows; // Retorna lista de usuarios con datos de empleado
}

// Actualizar usuario (ej. cambiar rol)
async function actualizarUsuario(id, datos) {
  const { correo, role_id } = datos;
  const [resultado] = await pool.query(
    "UPDATE usuarios SET correo = ?, role_id = ? WHERE id = ?",
    [correo, role_id, id]
  );
  return resultado.affectedRows; // Retorna número de filas afectadas
}

module.exports = {
  buscarPorCorreo,
  crearUsuario,
  verificarPassword,
  obtenerUsuarios,
  actualizarUsuario,
}; // Exporta las funciones para usar en controladores
