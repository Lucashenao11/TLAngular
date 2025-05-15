const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authService = require("../services/authService");

// Rutas de usuario
router.get("/getUsers", authService, usuarioController.getUsers);
router.delete("/deleteUser/:id", authService, usuarioController.deleteUser);
router.post("/updateUser/:id", authService, usuarioController.updateUser);
router.get("/getUserByUsername/:nombreUsuario", authService, usuarioController.getUserByUsername);

module.exports = router;
