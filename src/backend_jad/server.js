// server.js
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, correo, rol_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, rol_id) VALUES (?, ?, ?)',
      [nombre, correo, rol_id]
    );
    res.json({ message: 'Usuario agregado correctamente', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar el usuario' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3001');
});
