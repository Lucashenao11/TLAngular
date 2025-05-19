const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

const app = express();

// Cargar variables de entorno
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const logRoutes = require('./routes/logRoutes');
const expensesRoutes = require('./routes/expenseRoutes');

app.use('/auth', authRoutes);
app.use('/api/users', usuarioRoutes);
app.use('/api', logRoutes);
app.use('/api', expensesRoutes);

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
});

// Conectar a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a MySQL con Sequelize');
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err);
  });

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});