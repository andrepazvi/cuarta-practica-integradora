const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Optica Crisan',
      version: '1.0.0',
      description: 'Implementacion de logger',
    },
  },
  apis: [path.join(__dirname, '..', '..', 'docs', '**')],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
