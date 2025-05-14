const bcrypt = require("bcryptjs");
const { User, Log } = require("../models");

const getUsers = async (req, res) => {
  try {
    const empleados = await User.findAll({
      where: { role: 'empleado' }
    });
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreUsuario, password, rol } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreUsuario) usuario.nombreUser = nombreUsuario; // Asegúrate de usar nombreUser como en el modelo
    if (rol) usuario.role = rol;

    if (password) {
      usuario.password = await bcrypt.hash(password, 10); // Hashear la nueva contraseña
    }

    await usuario.save();
    await Log.create({ descripcion: `Empleado "${usuario.nombreUser}" actualizado.` });
    return res.status(200).json({ message: "Empleado actualizado", usuario });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!["Admin", "Empleado"].includes(rol)) {
      return res.status(400).json({ error: "Estado inválido. Use 'Admin' o 'Empleado'." });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.role = rol;
    await usuario.save();
    await Log.create({ descripcion: `Rol de "${usuario.nombreUser}" cambiado a ${rol}.` });

    res.json({ message: `Estado actualizado a ${rol}`, usuario });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, updateUser, changeUserStatus, getUserById };
