import { injectable } from '../config/dependency-injector.config.js';
import winston from 'winston';
import { CALL_LOG_LEVEL } from '../environment.js';

@injectable()
export class LoggerService {
	public readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			level: CALL_LOG_LEVEL,
			format: winston.format.combine(
				winston.format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss'
				}),
				winston.format.printf((info) => {
					return `${info.timestamp} [${info.level}] ${info.message}`;
				}),
				winston.format.errors({ stack: true })
				// winston.format.splat(),
				// winston.format.json()
			)
		});

		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.printf((info) => {
							return `${info.timestamp} [${info.level}] ${info.message}`;
						})
					)
				})
			);
		}
	}

	// Generic method to log messages with a specific level
	public log(level: string, message: string): void {
		this.logger.log(level, message);
	}

	// Logs a message as an error
	public error(message: string): void {
		this.log('error', message);
	}

	// Logs a message as a warning
	public warn(message: string): void {
		this.log('warn', message);
	}

	// Logs a message as general information
	public info(message: string): void {
		this.log('info', message);
	}

	// Logs a message as verbose
	public verbose(message: string): void {
		this.log('verbose', message);
	}

	// Logs a message for debugging purposes
	public debug(message: string): void {
		this.log('debug', message);
	}

	// Logs a message as trivial information
	public silly(message: string): void {
		this.log('silly', message);
	}
}
