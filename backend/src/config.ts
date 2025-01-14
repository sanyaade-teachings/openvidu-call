import dotenv from 'dotenv';

if (process.env.CALL_CONFIG_DIR) {
	dotenv.config({ path: process.env.CALL_CONFIG_DIR });
} else {
	dotenv.config();
}

// General server configuration
export const SERVER_PORT = process.env.SERVER_PORT || 6080;
export const SERVER_CORS_ORIGIN = process.env.SERVER_CORS_ORIGIN || '*';
export const CALL_NAME_ID = process.env.CALL_NAME_ID || 'openviduCall';
export const CALL_PRIVATE_ACCESS = process.env.CALL_PRIVATE_ACCESS || 'false';
export const CALL_USER = process.env.CALL_USER || 'user';
export const CALL_SECRET = process.env.CALL_SECRET || 'user';
export const CALL_ADMIN_USER = process.env.CALL_ADMIN_USER || 'admin';
export const CALL_ADMIN_SECRET = process.env.CALL_ADMIN_SECRET || 'admin';
export const CALL_PREFERENCES_STORAGE_MODE = process.env.CALL_PREFERENCES_STORAGE_MODE || 's3';
export const CALL_WEBHOOK_URL = process.env.CALL_WEBHOOK_URL || 'http://localhost:8080/';

/**
 * Log levels configuration: error, warn, info, verbose, debug, silly
 *
 * The default log level is set to 'verbose' if CALL_LOG_LEVEL environment variable is not defined.
 */
export const CALL_LOG_LEVEL = process.env.CALL_LOG_LEVEL || 'verbose';

// Livekit configuration
export const LIVEKIT_URL = process.env.LIVEKIT_URL || 'ws://localhost:7880';
export const LIVEKIT_URL_PRIVATE = process.env.LIVEKIT_URL_PRIVATE || LIVEKIT_URL;
export const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
export const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';

// S3 configuration
export const CALL_S3_BUCKET = process.env.CALL_S3_BUCKET || 'openvidu';
export const CALL_S3_SERVICE_ENDPOINT = process.env.CALL_S3_SERVICE_ENDPOINT || 'http://localhost:9000';
export const CALL_S3_ACCESS_KEY = process.env.CALL_S3_ACCESS_KEY || 'minioadmin';
export const CALL_S3_SECRET_KEY = process.env.CALL_S3_SECRET_KEY || 'minioadmin';
export const CALL_AWS_REGION = process.env.CALL_AWS_REGION || 'us-east-1';
export const CALL_S3_WITH_PATH_STYLE_ACCESS = process.env.CALL_S3_WITH_PATH_STYLE_ACCESS || 'true';

// Redis configuration
export const REDIS_HOST = process.env.CALL_REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.CALL_REDIS_PORT || 6379;
export const REDIS_USERNAME = process.env.CALL_REDIS_USERNAME || '';
export const REDIS_PASSWORD = process.env.CALL_REDIS_PASSWORD || 'redispassword';
export const REDIS_DB = process.env.CALL_REDIS_DB || 0;

// Redis configuration Sentinel
export const REDIS_SENTINEL_HOST_LIST = process.env.CALL_REDIS_SENTINEL_HOST_LIST || '';
export const REDIS_SENTINEL_PASSWORD = process.env.CALL_REDIS_SENTINEL_PASSWORD || '';
export const REDIS_SENTINEL_MASTER_NAME = process.env.CALL_REDIS_SENTINEL_MASTER_NAME || 'openvidu';

// Deployment related configuration
export const MODULES_FILE = process.env.MODULES_FILE || undefined;
export const MODULE_NAME = process.env.MODULE_NAME || 'openviduCall';
export const ENABLED_MODULES = process.env.ENABLED_MODULES || '';

export function checkModuleEnabled() {
	if (MODULES_FILE) {
		const moduleName = MODULE_NAME;
		const enabledModules = ENABLED_MODULES.split(',').map((module) => module.trim());

		if (!enabledModules.includes(moduleName)) {
			console.error(`Module ${moduleName} is not enabled`);
			process.exit(0);
		}
	}
}
