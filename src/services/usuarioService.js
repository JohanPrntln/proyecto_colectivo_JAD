// =============================
// SERVICIO: UsuarioService.js
// =============================
// Aquí definimos las funciones que el frontend usa
// para comunicarse con el backend (API REST).
// Usamos axios para las peticiones HTTP.

import api from './api'; // Usa el interceptor para token

const API_URL = "/usuarios"; // Relativo a baseURL de api.js

// ======================================================
// 📌 Función para crear usuario + empleado
// ======================================================
export async function crearUsuario(datosUsuario) {
  try {
    // Se envía al backend con token de autenticación (ya incluido en axios por interceptor)
    const response = await api.post(API_URL, datosUsuario);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

// ======================================================
// 📌 Función para listar todos los usuarios
// ======================================================
export async function listarUsuarios() {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    throw error;
  }
}
