import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'api/docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/api/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Application with swagger docs',
        version: '1.0.0',
        description:
          '**NATS API**\n\nMarkdown [documentation](https://gitlab.something.ru/pg-group/development/web/something-cube-new/cube-core-delivery/-/blob/develop/README.md)\n\nSwagger [documentation](https://cube-develop.something.ru/api/docs/index.html#/delivery)',
      },
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

    apis: [
      'app/**/*.ts',
      'docs/swagger/*.yml',
      'start/routes.ts',
      'app/Controllers/Http/*.ts',
      'app/Controllers/Http/**/*.ts',
      'app/Validators/*.ts',
    ],
    basePath: '/',
  },
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
  swaggerAuth: {
    authMiddleware: 'swagger-auth',
    authCredentials: {
      login: 'developer',
      password: 'maR95@n0',
    },
  },
} as SwaggerConfig
