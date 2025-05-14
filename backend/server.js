const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(cors()); // Permite que el frontend se conecte al backend
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);
app.use('/api/users', usuarioRoutes);

// Conectar a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// Puerto de escucha
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
