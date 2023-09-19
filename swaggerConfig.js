const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'TMS API Documentation', // Title of your API documentation
      version: '1.0.0', // Version of your API
      description: 'Documentation for TMS API', // Description of your API
    },
  },
  // Define the path to your API routes and files that contain JSDoc comments
  apis: ['./routes/*.js', './models/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
