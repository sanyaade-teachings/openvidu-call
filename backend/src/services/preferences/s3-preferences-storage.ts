/**
 * Implements storage for preferences using S3.
 * This is used when the application is configured to operate in "s3" mode.
 */

import { GlobalPreferences } from '@openvidu/call-common-types';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { S3Service } from '../s3.service.js';
import { LoggerService } from '../logger.service.js';
import { RedisService } from '../redis.service.js';
import { OpenViduCallError } from '../../models/error.model.js';

export class S3PreferenceStorage implements GlobalPreferencesStorage {
	protected readonly PREFERENCES_PATH = '.call-preferences';
	protected readonly PREFERENCES_KEY = 'call-preferences';
	protected s3Service = S3Service.getInstance();
	protected redisService = RedisService.getInstance();
	protected logger = LoggerService.getInstance();

	async initialize(defaultPreferences: GlobalPreferences): Promise<void> {
		const exist = await this.s3Service.exists(`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`);

		if (!exist) {
			this.logger.info('Saving default preferences to S3');
			await this.savePreferences(defaultPreferences);
		}
	}

	async getPreferences(): Promise<GlobalPreferences | null> {
		try {
			// Try fetching preferences from Redis
			let preferences: GlobalPreferences | null = await this.getFromRedis(this.PREFERENCES_KEY);

			if (!preferences) {
				// Fallback to fetching from S3 if Redis doesn't have it
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

	async savePreferences(preferences: GlobalPreferences): Promise<GlobalPreferences> {
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

	protected async getFromRedis(key: string): Promise<GlobalPreferences | null> {
		let preferencesCache: string | null = null;

		// Try to get preferences from Redis
		preferencesCache = await this.redisService.get(key);

		if (preferencesCache) {
			// Parse and return preferences if found in Redis
			return JSON.parse(preferencesCache) as GlobalPreferences;
		}

		return null;
	}

	protected async getFromS3(path: string): Promise<GlobalPreferences | null> {
		// If Redis didn't have the preferences, try fetching from S3
		const preferences = await this.s3Service.getObjectAsJson(path);

		if (preferences) {
			return preferences as GlobalPreferences;
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
