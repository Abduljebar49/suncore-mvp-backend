// utils/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SunCore API',
      version: '1.0.0',
      description: 'API documentation for the SunCore crypto backend',
    },
    servers: [
      {
        //  url: process.env.BACKEND_DO_DEV_URL,
        url: 'https://api.suncore-web.137.184.245.45.nip.io',
        description: 'Production server (DigitalOcean)',
      },
      {
        url: 'http://localhost:8000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/**/*.js', './models/**/*.js'], // Adjust paths as needed
  //   apis: ["./routes/*.js", "./models/*.js"], // Scan these files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'SunCore API',
//       version: '1.0.0',
//       description: 'API documentation for the SunCore crypto backend',
//     },
//     servers: [
//       {
//         url: process.env.BACKEND_DO_DEV_URL || 'http://localhost:8000/api/v1',
//       },
//     ],
//   },
//   apis: ['./routes/**/*.js', './models/**/*.js'], // Adjust paths as needed
// };

// const swaggerSpec = swaggerJSDoc(options);

// module.exports = {
//   swaggerUi,
//   swaggerSpec,
// };
