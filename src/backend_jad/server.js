// server.js
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
  const { correo, contrasena, role_id, activo = 1 } = req.body;
  console.log('📩 Datos recibidos:', req.body);

  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (correo, contrasena, role_id, activo, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
      [correo, contrasena, role_id, activo]
    );
    res.status(201).json({
      message: '✅ Usuario agregado correctamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('❌ Error al insertar:', error);
    res.status(500).json({ error: 'Error al insertar el usuario' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3001');
});

