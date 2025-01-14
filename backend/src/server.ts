import express, { Request, Response } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { indexHtmlPath, publicFilesPath } from './utils/path-utils.js';
import { apiRouter, livekitRouter } from './routes/index.js';
import {
	LIVEKIT_URL,
	LIVEKIT_API_KEY,
	LIVEKIT_API_SECRET,
	SERVER_PORT,
	CALL_PRIVATE_ACCESS,
	CALL_SECRET,
	CALL_USER,
	CALL_ADMIN_SECRET,
	LIVEKIT_URL_PRIVATE,
	CALL_S3_BUCKET,
	CALL_S3_SERVICE_ENDPOINT,
	CALL_S3_ACCESS_KEY,
	CALL_S3_SECRET_KEY,
	CALL_ADMIN_USER,
	CALL_AWS_REGION,
	CALL_LOG_LEVEL,
	CALL_NAME_ID,
	SERVER_CORS_ORIGIN,
	CALL_PREFERENCES_STORAGE_MODE,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_USERNAME,
	REDIS_PASSWORD,
	REDIS_SENTINEL_HOST_LIST
} from './config.js';
import { embeddedRouter } from './routes/embedded.routes.js';
import { GlobalPreferencesService } from './services/index.js';
import { swaggerDocs, swaggerUi } from './config/swagger.js';

const createApp = () => {
	const app = express();

	// Enable CORS support
	if (SERVER_CORS_ORIGIN) {
		app.use(cors({ origin: SERVER_CORS_ORIGIN }));
	}

	app.use(express.static(publicFilesPath));
	app.use(express.json());

	// Setup routes
	app.use('/call/api', apiRouter);
	app.use('/embedded/api', embeddedRouter);
	app.use('/livekit', livekitRouter);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
	app.get(/^(?!\/api).*$/, (req: Request, res: Response) => {
		res.sendFile(indexHtmlPath);
	});

	return app;
};

const logEnvVars = () => {
	const credential = chalk.yellow;
	const text = chalk.cyanBright;
	const enabled = chalk.greenBright;
	const disabled = chalk.redBright;

	console.log(' ');
	console.log('---------------------------------------------------------');
	console.log('OpenVidu Call Server Configuration');
	console.log('---------------------------------------------------------');
	console.log('SERVICE NAME ID: ', text(CALL_NAME_ID));
	console.log('CORS ORIGIN:', text(SERVER_CORS_ORIGIN));
	console.log('CALL LOG LEVEL: ', text(CALL_LOG_LEVEL));
	console.log(
		'CALL PRIVATE ACCESS: ',
		CALL_PRIVATE_ACCESS === 'true' ? enabled(CALL_PRIVATE_ACCESS) : disabled(CALL_PRIVATE_ACCESS)
	);

	if (CALL_PRIVATE_ACCESS === 'true') {
		console.log('CALL USER: ', credential('****' + CALL_USER.slice(-3)));
		console.log('CALL SECRET: ', credential('****' + CALL_SECRET.slice(-3)));
	}

	console.log('CALL ADMIN USER: ', credential('****' + CALL_ADMIN_USER.slice(-3)));
	console.log('CALL ADMIN PASSWORD: ', credential('****' + CALL_ADMIN_SECRET.slice(-3)));
	console.log('CALL PREFERENCES STORAGE:', text(CALL_PREFERENCES_STORAGE_MODE));

	console.log('---------------------------------------------------------');
	console.log('LIVEKIT Configuration');
	console.log('---------------------------------------------------------');
	console.log('LIVEKIT URL: ', text(LIVEKIT_URL));
	console.log('LIVEKIT URL PRIVATE: ', text(LIVEKIT_URL_PRIVATE));
	console.log('LIVEKIT API SECRET: ', credential('****' + LIVEKIT_API_SECRET.slice(-3)));
	console.log('LIVEKIT API KEY: ', credential('****' + LIVEKIT_API_KEY.slice(-3)));
	console.log('---------------------------------------------------------');
	console.log('S3 Configuration');
	console.log('---------------------------------------------------------');
	console.log('CALL S3 BUCKET:', text(CALL_S3_BUCKET));
	console.log('CALL S3 SERVICE ENDPOINT:', text(CALL_S3_SERVICE_ENDPOINT));
	console.log('CALL S3 ACCESS KEY:', credential('****' + CALL_S3_ACCESS_KEY.slice(-3)));
	console.log('CALL S3 SECRET KEY:', credential('****' + CALL_S3_SECRET_KEY.slice(-3)));
	console.log('CALL AWS REGION:', text(CALL_AWS_REGION));
	console.log('---------------------------------------------------------');
	console.log('Redis Configuration');
	console.log('---------------------------------------------------------');
	console.log('REDIS HOST:', text(REDIS_HOST));
	console.log('REDIS PORT:', text(REDIS_PORT));
	console.log('REDIS USERNAME:', credential('****' + REDIS_USERNAME.slice(-3)));
	console.log('REDIS PASSWORD:', credential('****' + REDIS_PASSWORD.slice(-3)));

	if (REDIS_SENTINEL_HOST_LIST !== '') {
		console.log('REDIS SENTINEL IS ENABLED');
		console.log('REDIS SENTINEL HOST LIST:', text(REDIS_SENTINEL_HOST_LIST));
	}

	console.log('---------------------------------------------------------');
	console.log(' ');
};

const startServer = (app: express.Application) => {
	app.listen(SERVER_PORT, () => {
		console.log(' ');
		console.log('---------------------------------------------------------');
		console.log(' ');
		console.log('OpenVidu Call Server is listening on port', chalk.cyanBright(SERVER_PORT));
		console.log('REST API Docs: ', chalk.cyanBright(`http://localhost:${SERVER_PORT}/api-docs`));
		logEnvVars();
		GlobalPreferencesService.getInstance().ensurePreferencesInitialized();
	});
};

/**
 * Determines if the current module is the main entry point of the application.
 * @returns {boolean} True if this module is the main entry point, false otherwise.
 */
const isMainModule = (): boolean => {
	const importMetaUrl = import.meta.url;
	let processArgv1 = process.argv[1];

	if (process.platform === 'win32') {
		processArgv1 = processArgv1.replace(/\\/g, '/');
		processArgv1 = `file:///${processArgv1}`;
	} else {
		processArgv1 = `file://${processArgv1}`;
	}

	return importMetaUrl === processArgv1;
};

if (isMainModule()) {
	const app = createApp();
	startServer(app);
}

export { logEnvVars };
