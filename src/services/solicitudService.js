import api from './api';

export const solicitudService = {
  // Crear solicitud
  crearSolicitud: async (datos) => {
    const response = await api.post('/solicitudes', datos);
    return response.data;
  },

  // Listar todas las solicitudes (para RRHH/jefe)
  listarSolicitudes: async () => {
    const response = await api.get('/solicitudes');
    return response.data;
  },

  // Listar solicitudes del empleado logueado
  listarMisSolicitudes: async () => {
    const response = await api.get('/solicitudes/mias');
    return response.data;
  },

  // Actualizar estado de solicitud (aprobar/rechazar)
  actualizarEstado: async (id, estado, remunerado = null) => {
    const response = await api.put(`/solicitudes/${id}`, {
      estado,
      remunerado
    });
    return response.data;
  }
};

export default solicitudService;
