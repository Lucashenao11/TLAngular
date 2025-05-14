const bcrypt = require("bcryptjs");
const { Usuario } = require("../models");

const getUsers = async (req, res) => {
  try {
    const empleados = await Usuario.findAll({
      where: { role: 'empleado' }
    });
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreUsuario, password, rol } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (nombreUsuario) usuario.nombre = nombreUsuario;
        if (rol) usuario.rol = rol;
        
        if (password) {
            usuario.password = await bcrypt.hash(password, 10); // Hashear la nueva contraseña
        }

        await usuario.save();
        return res.status(200).json({ message: "Usuario actualizado", usuario })
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario recibido en la URL
        const { rol } = req.body; 

        // Validar que el rol sea "Admin" o "Empleado"
        if (!["Admin", "Empleado"].includes(rol)) {
            return res.status(400).json({ error: "Estado inválido. Use 'Admin' o 'Empleado'." });
        }

        // Buscar el usuario por ID
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Actualizar el estado del usuario
        usuario.rol = rol;
        await usuario.save();

        res.json({ message: `Estado actualizado a ${rol}`, usuario });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getUsers, updateUser, changeUserStatus, getUserById }