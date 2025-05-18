// authController.js
const { User, Log } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { nombreUsuario, password } = req.body;

    // Buscar usuario por nombreUsuario
    const usuario = await User.findOne({ where: { nombreUser: nombreUsuario } });

    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado." });
    }

    // Validar contraseña
    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecto) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, nombreUsuario: usuario.nombreUser, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const register = async (req, res) => {
  try {
    const { nombreUsuario, password, role } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ where: { nombreUser: nombreUsuario } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El nombre de usuario ya existe." });
    }

    // Crear el nuevo usuario (bcrypt se aplica en el hook beforeCreate)
    const nuevoUsuario = await User.create({
      nombreUser: nombreUsuario,
      password,
      role: role.toLowerCase()
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, nombreUsuario: nuevoUsuario.nombreUser },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (nuevoUsuario.role === 'empleado') {
      await Log.create({ descripcion: `Empleado "${nuevoUsuario.nombreUser}" agregado.` });
    }



    res.status(201).json({ message: "Usuario registrado correctamente", token });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

module.exports = { login, register };
