// server.js - Punto de entrada del backend de JAD
// Configura y inicia el servidor Express en el puerto especificado.

require('dotenv').config(); // Carga variables de entorno
const app = require('./src/app'); // Importa app Express
const PORT = process.env.PORT || 4000; // Puerto, defecto 4000
app.listen(PORT, () => console.log(`JAD backend en http://localhost:${PORT}`)); // Inicia servidor
