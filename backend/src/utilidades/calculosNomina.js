// ==========================
// UTILIDADES DE CÁLCULOS DE NÓMINA
// ==========================
// Funciones para calcular deducciones y total pagado de nómina.

function calcularDeducciones(salarioBase) {
  const salud = salarioBase * 0.04;
  const pension = salarioBase * 0.04;
  return salud + pension;
}

function calcularTotalPagado(salarioBase, deducciones) {
  return salarioBase - deducciones;
}

module.exports = { calcularDeducciones, calcularTotalPagado };
