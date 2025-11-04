// =============================
// SERVICIO: NominaService.js
// =============================
// Funciones para consumir las APIs de nóminas desde el frontend.
// Incluye funciones para listar, crear, obtener y eliminar nóminas.

import api from './api'; // Usa el interceptor para token JWT

const API_URL = "/nominas"; // Relativo a baseURL de api.js

// ======================================================
// 📌 Función para listar todas las nóminas (con filtros opcionales)
// ======================================================
export async function listarNominas(filtros = {}) {
  try {
    const params = new URLSearchParams();
    if (filtros.empleado_id) params.append('empleado_id', filtros.empleado_id);
    if (filtros.desde) params.append('desde', filtros.desde);
    if (filtros.hasta) params.append('hasta', filtros.hasta);

    const response = await api.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar nóminas:", error);
    throw error;
  }
}

// ======================================================
// 📌 Función para obtener nómina por ID
// ======================================================
export async function obtenerNominaPorId(id) {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener nómina:", error);
    throw error;
  }
}

// ======================================================
// 📌 Función para generar nueva nómina
// ======================================================
export async function generarNomina(datosNomina) {
  try {
    const response = await api.post(`${API_URL}/generar`, datosNomina);
    return response.data;
  } catch (error) {
    console.error("Error al generar nómina:", error);
    throw error;
  }
}

// ======================================================
// 📌 Función para eliminar nómina (opcional)
// ======================================================
export async function eliminarNomina(id) {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar nómina:", error);
    throw error;
  }
}

// ======================================================
// 📌 Función para listar nóminas del empleado actual
// ======================================================
export async function listarMisNominas() {
  try {
    const response = await api.get(`${API_URL}/mias`);
    return response.data;
  } catch (error) {
    console.error("Error al listar mis nóminas:", error);
    throw error;
  }
}
