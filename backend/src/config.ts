import dotenv from 'dotenv';

if (process.env.CALL_CONFIG_DIR) {
	dotenv.config({ path: process.env.CALL_CONFIG_DIR });
} else {
	dotenv.config();
}

// General server configuration
export const SERVER_PORT = process.env.SERVER_PORT || 6080;
export const SERVER_CORS_ORIGIN = process.env.SERVER_CORS_ORIGIN || '*';
export const CALL_NAME_ID = process.env.CALL_NAME_ID || 'OpenViduCall';
export const CALL_PRIVATE_ACCESS = process.env.CALL_PRIVATE_ACCESS || 'false';
export const CALL_USER = process.env.CALL_USER || 'user';
export const CALL_SECRET = process.env.CALL_SECRET || 'user';
export const CALL_ADMIN_USER = process.env.CALL_ADMIN_USER || 'admin';
export const CALL_ADMIN_SECRET = process.env.CALL_ADMIN_SECRET || 'admin';
// Storage mode for global preferences.
// The default storage mode is set to 's3'
export const CALL_PREFERENCES_STORAGE_MODE = process.env.CALL_PREFERENCES_STORAGE_MODE || 'db';

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

// Sequelize configuration
// Database configuration applies only if CALL_PREFERENCES_STORAGE_MODE='s3'
export const DB_NAME = process.env.DB_NAME || 'openvidu';
// 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle';
export const DB_DIALECT = process.env.DB_DIALECT || 'mysql';
export const DB_USER = process.env.DB_USER || 'admin';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
export const DB_HOST = process.env.DB_HOST || 'localhost';
