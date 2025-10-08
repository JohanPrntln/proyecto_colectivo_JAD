import React from 'react';
import './Nomina.css';

export default function Nomina() {
  // Datos simulados del empleado
  const empleado = {
    nombre: 'Juan Pérez',
    identificacion: '123456789',
    cargo: 'Analista de Datos',
    salarioBase: 1160000, // Salario mínimo en Colombia (2023)
    bonificaciones: 200000, // Bonificaciones adicionales
  };

  // Cálculos de deducciones
  const deducciones = {
    salud: empleado.salarioBase * 0.04, // 4% para salud
    pension: empleado.salarioBase * 0.04, // 4% para pensión
    fondoSolidaridad: empleado.salarioBase > 4000000 ? empleado.salarioBase * 0.01 : 0, // 1% si el salario es mayor a 4M
  };

  const totalDeducciones =
    deducciones.salud + deducciones.pension + deducciones.fondoSolidaridad;

  // Salario neto
  const salarioNeto =
    empleado.salarioBase + empleado.bonificaciones - totalDeducciones;

  return (
    <div className="nomina-container">
      <h1>Mi Nómina</h1>
      <div className="datos-empleado">
        <p><strong>Nombre:</strong> {empleado.nombre}</p>
        <p><strong>Identificación:</strong> {empleado.identificacion}</p>
        <p><strong>Cargo:</strong> {empleado.cargo}</p>
      </div>

      <table className="nomina-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Salario Base</td>
            <td>${empleado.salarioBase.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Bonificaciones</td>
            <td>${empleado.bonificaciones.toLocaleString()}</td>
          </tr>
          <tr className="deducciones-header">
            <td colSpan="2"><strong>Deducciones</strong></td>
          </tr>
          <tr>
            <td>Salud (4%)</td>
            <td>-${deducciones.salud.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Pensión (4%)</td>
            <td>-${deducciones.pension.toLocaleString()}</td>
          </tr>
          {deducciones.fondoSolidaridad > 0 && (
            <tr>
              <td>Fondo de Solidaridad (1%)</td>
              <td>-${deducciones.fondoSolidaridad.toLocaleString()}</td>
            </tr>
          )}
          <tr className="total-deducciones">
            <td><strong>Total Deducciones</strong></td>
            <td>-${totalDeducciones.toLocaleString()}</td>
          </tr>
          <tr className="salario-neto">
            <td><strong>Salario Neto</strong></td>
            <td>${salarioNeto.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}