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

    const role = usuario.role

    await usuario.destroy();
    await Log.create({ descripcion: `${role} "${usuario.nombreUser}" eliminado.` });

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreUsuario, password } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreUsuario) usuario.nombreUser = nombreUsuario;

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    await usuario.save();
    await Log.create({ descripcion: `Empleado "${usuario.nombreUser}" actualizado.` });
    return res.status(200).json({ message: "Empleado actualizado", usuario });

  } catch (error) {
    res.status(500).json({ error: error.message });
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


module.exports = { getUsers, deleteUser, updateUser, getUserByUsername };
