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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const role = usuario.role;
    await usuario.destroy();
    if (role !== 'admin') {
      await Log.create({ descripcion: `${role} "${usuario.nombreUser}" eliminado.` });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreUsuario, password } = req.body;

    console.log('Update user request:', { id, nombreUsuario, password }); // Debug log

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updates = {};
    if (nombreUsuario && nombreUsuario !== usuario.nombreUser) {
      const existingUser = await User.findOne({ where: { nombreUser: nombreUsuario } });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ message: "El nombre de usuario ya existe." });
      }
      updates.nombreUser = nombreUsuario;
    }
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ message: "No se proporcionaron cambios.", usuario });
    }

    await usuario.update(updates);

    if (usuario.role !== 'admin') {
      await Log.create({ descripcion: `Empleado "${usuario.nombreUser}" actualizado.` });
      return res.status(200).json({ message: "Empleado actualizado", usuario });
    } else {
      return res.status(200).json({ message: "Administrador actualizado", usuario });
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: "Error al actualizar usuario.", error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { nombreUsuario } = req.params;
    const usuario = await User.findOne({ where: { nombreUser: nombreUsuario } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  console.log('Handling GET /api/users/me for userId:', req.userId);
  try {
    const usuario = await User.findByPk(req.userId, {
      attributes: ['id', 'nombreUser', 'role']
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, deleteUser, updateUser, getUserByUsername, getCurrentUser };