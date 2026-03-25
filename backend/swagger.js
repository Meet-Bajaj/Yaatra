const path = require("path");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const env = require("./config/env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RickRide API",
      version: "1.0.0",
      description: "API documentation for the RickRide backend services",
    },
    servers: [
      {
        url: env.appBaseUrl,
        description: `${env.nodeEnv} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
