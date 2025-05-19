const { Expense, User } = require('../models');

const createExpense = async (req, res) => {
  try {
    const { amount, description, type } = req.body;
    const nombreUser = req.userNombreUsuario;
    console.log('Crear petición de gasto:', { amount, description, type, nombreUser });

    if (!nombreUser) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    const user = await User.findOne({ where: { nombreUser } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const expense = await Expense.create({
      amount,
      description,
      type,
      nombreUser,
    });

    res.status(201).json({ message: 'Gasto registrado correctamente.', expense });
  } catch (error) {
    console.error('Error al registrar gasto:', error);
    res.status(500).json({ message: 'Error al registrar gasto.', error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const nombreUser = req.userNombreUsuario;
    console.log('Obtener gastos del empleado:', nombreUser);

    if (!nombreUser) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    const expenses = await Expense.findAll({
      where: { nombreUser },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    res.status(500).json({ message: 'Error al obtener gastos.', error: error.message });
  }
};

module.exports = { createExpense, getExpenses };