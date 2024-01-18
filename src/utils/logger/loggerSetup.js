const loggerMiddleware = require('./loggerMiddleware');

// Crear un objeto req vacío
const req = {};

// Aplicar el middleware para configurar req.logger
loggerMiddleware(req, null, () => {});

// Exportar req configurado con el middleware
module.exports = req;
