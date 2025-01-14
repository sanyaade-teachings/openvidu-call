// src/swagger.ts

import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: Options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'OpenVidu Embedded REST API',
			version: '1.0.0',
			description: 'REST API for the OpenVidu Embedded application'
		},
		servers: [
			{
				url: 'http://localhost:6080'
			}
		]
	},
	apis: ['src/routes/embedded.routes.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
