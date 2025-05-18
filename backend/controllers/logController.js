const { Log } = require("../models");

const getRecentLogs = async (req, res) => {
  try {
    // Obtener los 5 logs más recientes
    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']], // Ordenar por la fecha de creación (más recientes primero)
      limit: 5 
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error al obtener logs:", error);
    res.status(500).json({ error: "Error al obtener logs" });
  }
};

module.exports = { getRecentLogs };
