import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, Button, Form, Row, Col, Table, Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import './RRHHReportes.css';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

// Simulación de datos para reportes
const datosSimulados = {
  nomina: [
    { nombre: 'Juan Pérez', salario: 2500000, deducciones: 300000, neto: 2200000 },
    { nombre: 'Ana Gómez', salario: 3200000, deducciones: 400000, neto: 2800000 },
    { nombre: 'Carlos Ruiz', salario: 2800000, deducciones: 350000, neto: 2450000 },
  ],
  asistencia: [
    { nombre: 'Juan Pérez', asistencias: 20, ausencias: 2, retardos: 1 },
    { nombre: 'Ana Gómez', asistencias: 22, ausencias: 0, retardos: 0 },
    { nombre: 'Carlos Ruiz', asistencias: 18, ausencias: 4, retardos: 2 },
  ],
  clima: [
    { area: 'Recursos Humanos', satisfaccion: 85 },
    { area: 'Operaciones', satisfaccion: 72 },
    { area: 'Finanzas', satisfaccion: 90 },
    { area: 'IT', satisfaccion: 78 },
  ],
  rotacion: [
    { mes: 'Enero', ingresos: 2, salidas: 1 },
    { mes: 'Febrero', ingresos: 1, salidas: 0 },
    { mes: 'Marzo', ingresos: 0, salidas: 2 },
  ],
  solicitudes: [
    { tipo: 'Vacaciones', cantidad: 12, tiempoPromedio: 2.5 },
    { tipo: 'Permisos', cantidad: 8, tiempoPromedio: 1.2 },
    { tipo: 'Incapacidades', cantidad: 3, tiempoPromedio: 3.1 },
  ],
  diversidad: [
    { categoria: 'Mujeres', cantidad: 15 },
    { categoria: 'Hombres', cantidad: 20 },
    { categoria: 'Otro', cantidad: 1 },
  ],
};

const tiposReporte = [
  {
    key: 'nomina',
    nombre: 'Nómina',
    descripcion: 'Detalle de pagos, deducciones y neto por empleado.',
    grafico: 'bar',
  },
  {
    key: 'asistencia',
    nombre: 'Asistencia y Ausentismo',
    descripcion: 'Registro de asistencias, ausencias y retardos.',
    grafico: 'bar',
  },
  {
    key: 'clima',
    nombre: 'Clima Laboral',
    descripcion: 'Resultados de encuestas de satisfacción por área.',
    grafico: 'pie',
  },
  {
    key: 'rotacion',
    nombre: 'Rotación de Personal',
    descripcion: 'Ingresos y salidas de empleados por mes.',
    grafico: 'line',
  },
  {
    key: 'solicitudes',
    nombre: 'Solicitudes y Tiempos de Respuesta',
    descripcion: 'Cantidad y tiempo promedio de respuesta por tipo de solicitud.',
    grafico: 'bar',
  },
  {
    key: 'diversidad',
    nombre: 'Diversidad e Inclusión',
    descripcion: 'Estadísticas de género y diversidad.',
    grafico: 'pie',
  },
];

export default function RRHHReportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(tiposReporte[0]);
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '', area: '' });

  // Simulación de exportar
  const handleExportar = (tipo) => {
    alert(`Exportando reporte de ${tipo.nombre} a Excel/PDF (listo para backend).`);
  };

  // Filtros (simulados)
  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Renderizado de gráficos según tipo de reporte
  const renderGrafico = () => {
    switch (reporteSeleccionado.key) {
      case 'nomina':
        return (
          <Bar
            data={{
              labels: datosSimulados.nomina.map(e => e.nombre),
              datasets: [
                {
                  label: 'Salario Neto',
                  data: datosSimulados.nomina.map(e => e.neto),
                  backgroundColor: '#1a73e8',
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        );
      case 'asistencia':
        return (
          <Bar
            data={{
              labels: datosSimulados.asistencia.map(e => e.nombre),
              datasets: [
                {
                  label: 'Asistencias',
                  data: datosSimulados.asistencia.map(e => e.asistencias),
                  backgroundColor: '#43a047',
                },
                {
                  label: 'Ausencias',
                  data: datosSimulados.asistencia.map(e => e.ausencias),
                  backgroundColor: '#e53935',
                },
                {
                  label: 'Retardos',
                  data: datosSimulados.asistencia.map(e => e.retardos),
                  backgroundColor: '#fbc02d',
                },
              ],
            }}
            options={{ responsive: true }}
          />
        );
      case 'clima':
        return (
          <Pie
            data={{
              labels: datosSimulados.clima.map(e => e.area),
              datasets: [
                {
                  label: 'Satisfacción (%)',
                  data: datosSimulados.clima.map(e => e.satisfaccion),
                  backgroundColor: ['#1a73e8', '#43a047', '#fbc02d', '#e53935'],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        );
      case 'rotacion':
        return (
          <Line
            data={{
              labels: datosSimulados.rotacion.map(e => e.mes),
              datasets: [
                {
                  label: 'Ingresos',
                  data: datosSimulados.rotacion.map(e => e.ingresos),
                  borderColor: '#43a047',
                  backgroundColor: '#43a04733',
                  tension: 0.3,
                },
                {
                  label: 'Salidas',
                  data: datosSimulados.rotacion.map(e => e.salidas),
                  borderColor: '#e53935',
                  backgroundColor: '#e5393533',
                  tension: 0.3,
                },
              ],
            }}
            options={{ responsive: true }}
          />
        );
      case 'solicitudes':
        return (
          <Bar
            data={{
              labels: datosSimulados.solicitudes.map(e => e.tipo),
              datasets: [
                {
                  label: 'Cantidad',
                  data: datosSimulados.solicitudes.map(e => e.cantidad),
                  backgroundColor: '#1a73e8',
                },
                {
                  label: 'Tiempo Promedio (días)',
                  data: datosSimulados.solicitudes.map(e => e.tiempoPromedio),
                  backgroundColor: '#fbc02d',
                },
              ],
            }}
            options={{ responsive: true }}
          />
        );
      case 'diversidad':
        return (
          <Pie
            data={{
              labels: datosSimulados.diversidad.map(e => e.categoria),
              datasets: [
                {
                  label: 'Cantidad',
                  data: datosSimulados.diversidad.map(e => e.cantidad),
                  backgroundColor: ['#1a73e8', '#43a047', '#e53935'],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        );
      default:
        return null;
    }
  };

  // Renderizado de tabla según tipo de reporte
  const renderTabla = () => {
    switch (reporteSeleccionado.key) {
      case 'nomina':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Salario</th>
                <th>Deducciones</th>
                <th>Neto</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.nomina.map((e, i) => (
                <tr key={i}>
                  <td>{e.nombre}</td>
                  <td>${e.salario.toLocaleString()}</td>
                  <td>${e.deducciones.toLocaleString()}</td>
                  <td><b>${e.neto.toLocaleString()}</b></td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'asistencia':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Asistencias</th>
                <th>Ausencias</th>
                <th>Retardos</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.asistencia.map((e, i) => (
                <tr key={i}>
                  <td>{e.nombre}</td>
                  <td>{e.asistencias}</td>
                  <td>{e.ausencias}</td>
                  <td>{e.retardos}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'clima':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Área</th>
                <th>Satisfacción (%)</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.clima.map((e, i) => (
                <tr key={i}>
                  <td>{e.area}</td>
                  <td>
                    <Badge bg={e.satisfaccion > 80 ? 'success' : e.satisfaccion > 70 ? 'warning' : 'danger'}>
                      {e.satisfaccion}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'rotacion':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Ingresos</th>
                <th>Salidas</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.rotacion.map((e, i) => (
                <tr key={i}>
                  <td>{e.mes}</td>
                  <td>{e.ingresos}</td>
                  <td>{e.salidas}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'solicitudes':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Tiempo Promedio (días)</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.solicitudes.map((e, i) => (
                <tr key={i}>
                  <td>{e.tipo}</td>
                  <td>{e.cantidad}</td>
                  <td>{e.tiempoPromedio}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'diversidad':
        return (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {datosSimulados.diversidad.map((e, i) => (
                <tr key={i}>
                  <td>{e.categoria}</td>
                  <td>{e.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      default:
        return null;
    }
  };

  return (
    <Layout rrhhMenu>
      <div className="rrhh-reportes-container">
        <h2 className="mb-4">Panel de Reportes y Analítica RRHH</h2>
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Label><b>Tipo de Reporte</b></Form.Label>
                <DropdownButton
                  title={reporteSeleccionado.nombre}
                  onSelect={key => setReporteSeleccionado(tiposReporte.find(r => r.key === key))}
                  variant="outline-primary"
                >
                  {tiposReporte.map(r => (
                    <Dropdown.Item key={r.key} eventKey={r.key}>
                      {r.nombre}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col>
              <Col md={8}>
                <Form.Label><b>Filtros</b></Form.Label>
                <Row>
                  <Col md={4}>
                    <Form.Control
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltro}
                      placeholder="Desde"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="date"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFiltro}
                      placeholder="Hasta"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      placeholder="Área (opcional)"
                      name="area"
                      value={filtros.area}
                      onChange={handleFiltro}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">{reporteSeleccionado.nombre} - Gráfico</h5>
                {renderGrafico()}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">{reporteSeleccionado.nombre} - Detalle</h5>
                <div className="tabla-reportes">
                  {renderTabla()}
                </div>
                <Button
                  variant="outline-success"
                  className="mt-3 float-end"
                  onClick={() => handleExportar(reporteSeleccionado)}
                >
                  Exportar Excel/PDF
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card className="shadow-sm">
          <Card.Body>
            <h5>Indicadores Clave (KPI) RRHH</h5>
            <Row className="kpi-row">
              <Col md={3}>
                <div className="kpi-card kpi-blue">
                  <div className="kpi-title">Rotación</div>
                  <div className="kpi-value">8%</div>
                  <div className="kpi-desc">Últimos 12 meses</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="kpi-card kpi-green">
                  <div className="kpi-title">Satisfacción</div>
                  <div className="kpi-value">82%</div>
                  <div className="kpi-desc">Promedio global</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="kpi-card kpi-yellow">
                  <div className="kpi-title">Tiempo Resp.</div>
                  <div className="kpi-value">1.8d</div>
                  <div className="kpi-desc">Solicitudes</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="kpi-card kpi-red">
                  <div className="kpi-title">Ausentismo</div>
                  <div className="kpi-value">3.2%</div>
                  <div className="kpi-desc">Último mes</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}