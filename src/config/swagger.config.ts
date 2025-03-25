// swagger.config.ts
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API RESTful de datos falsos for frontend testing',
    },
    servers: [
      {
        url: 'http://localhost:4005',
      },
    ],
    components: {
      schemas: {
        FakeData: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              example: 1
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            direccion: {
              type: 'string',
              example: '123 Main St'
            },
            nacimiento: {
              type: 'string',
              format: 'date',
              example: '1990-01-01'
            }
          },
          required: ['id', 'name']
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/interfaces/*.ts'],
};

const specs = swaggerJsDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'API Documentation'
  }));
};