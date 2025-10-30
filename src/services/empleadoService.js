// =============================
// SERVICIO: empleadoService.js
// =============================
// Funciones para comunicarse con el backend de empleados.

import api from './api'; // Usa el interceptor para token

const API_URL = "/empleados"; // Relativo a baseURL de api.js

export async function listarEmpleados() {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al listar empleados:", error);
    throw error;
  }
}

export async function crearEmpleado(datosEmpleado) {
  try {
    const response = await api.post(API_URL, datosEmpleado);
    return response.data;
  } catch (error) {
    console.error("Error al crear empleado:", error);
    throw error;
  }
}

export async function actualizarEmpleado(id, datosEmpleado) {
  try {
    const response = await api.put(`${API_URL}/${id}`, datosEmpleado);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    throw error;
  }
}

export async function eliminarEmpleado(id) {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    throw error;
  }
}
export async function obtenerEmpleadoPorId(id) {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener empleado por ID:", error);
    throw error;
  }
}
