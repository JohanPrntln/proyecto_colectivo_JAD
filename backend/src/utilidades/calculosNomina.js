// ==========================
// UTILIDADES DE CÁLCULOS DE NÓMINA
// ==========================
// Funciones auxiliares para calcular deducciones y total pagado en nóminas.
// Basado en leyes colombianas: 4% salud + 4% pensión.

function calcularDeducciones(salarioBase) {
  const salud = salarioBase * 0.04; // Deducción de salud (4%)
  const pension = salarioBase * 0.04; // Deducción de pensión (4%)
  return salud + pension; // Retorna total de deducciones
}

function calcularTotalPagado(salarioBase, deducciones) {
  return salarioBase - deducciones; // Salario base menos deducciones
}

module.exports = { calcularDeducciones, calcularTotalPagado }; // Exporta las funciones para usar en controladores
