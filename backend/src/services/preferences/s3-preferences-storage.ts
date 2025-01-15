/**
 * Implements storage for preferences using S3.
 * This is used when the application is configured to operate in "s3" mode.
 */

import { GlobalPreferences } from '@typings-ce';
import { PreferencesStorage } from './global-preferences-storage.interface.js';
import { S3Service } from '../s3.service.js';
import { LoggerService } from '../logger.service.js';
import { RedisService } from '../redis.service.js';
import { OpenViduCallError } from '../../models/error.model.js';
import { inject, injectable  } from '../../config/dependency-injector.config.js';

@injectable()
export class S3PreferenceStorage<T extends GlobalPreferences = GlobalPreferences> implements PreferencesStorage {
	protected readonly PREFERENCES_PATH = '.call-preferences';
	protected readonly PREFERENCES_KEY = 'call-preferences';
	constructor(
		@inject(LoggerService) protected logger: LoggerService,
		@inject(S3Service) protected s3Service: S3Service,
		@inject(RedisService) protected redisService: RedisService
	) {}

	async initialize(defaultPreferences: T): Promise<void> {
		const existingPreferences = await this.getPreferences();

		if (existingPreferences) {
			if (existingPreferences.projectId !== defaultPreferences.projectId) {
				this.logger.warn(
					`Existing preferences are associated with a different project (Project ID: ${existingPreferences.projectId}). Replacing them with the default preferences for the current project.`
				);

				await this.savePreferences(defaultPreferences);
			}
		} else {
			this.logger.info('Saving default preferences to S3');
			await this.savePreferences(defaultPreferences);
		}
	}

	async getPreferences(): Promise<T | null> {
		try {
			let preferences: T | null = await this.getFromRedis(this.PREFERENCES_KEY);

			if (!preferences) {
				// Fallback to fetching from S3 if Redis doesn't have it
				this.logger.verbose('Preferences not found in Redis. Fetching from S3...');
				preferences = await this.getFromS3(`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`);

				if (preferences) {
					await this.redisService.set(this.PREFERENCES_KEY, JSON.stringify(preferences), false);
				}
			}

			return preferences;
		} catch (error) {
			this.handleError(error, 'Error fetching preferences');
			return null;
		}
	}

	async savePreferences(preferences: T): Promise<T> {
		try {
			await Promise.all([
				this.s3Service.saveObject(
					`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`,
					JSON.stringify(preferences)
				),
				this.redisService.set(this.PREFERENCES_KEY, JSON.stringify(preferences), false)
			]);
			return preferences;
		} catch (error) {
			this.handleError(error, 'Error saving preferences');
			throw error;
		}
	}

	protected async getFromRedis(key: string): Promise<T | null> {
		let preferencesCache: string | null = null;

		preferencesCache = await this.redisService.get(key);

		if (preferencesCache) {
			this.logger.verbose(`Object ${key} found in Redis`);
			return JSON.parse(preferencesCache) as T;
		}

		return null;
	}

	protected async getFromS3(path: string): Promise<T | null> {
		const preferences = await this.s3Service.getObjectAsJson(path);

		if (preferences) {
			this.logger.verbose(`Preferences found in S3 at path: ${path}`);
			return preferences as T;
		}

		return null;
	}

	protected handleError(error: any, message: string) {
		if (error instanceof OpenViduCallError) {
			this.logger.error(`${message}: ${error.message}`);
		} else {
			this.logger.error(`${message}: Unexpected error`);
		}
	}
}
