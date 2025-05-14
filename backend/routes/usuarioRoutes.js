const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authService = require("../services/authService");

// Rutas de usuario
router.get("/getUsers", authService, usuarioController.getUsers);
router.post("/:id", authService, usuarioController.updateUser);
router.post("/ChangeStatus/:id", authService, usuarioController.changeUserStatus);
router.get("/:id", authService, usuarioController.getUserById);

module.exports = router;
