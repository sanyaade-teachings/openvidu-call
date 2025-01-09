/**
 * Implements storage for preferences using S3.
 * This is used when the application is configured to operate in "s3" mode.
 */

import { RoomPreferences } from '@openvidu/call-common-types';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { S3Service } from '../s3.service.js';
import { LoggerService } from '../logger.service.js';
import { RedisService } from '../redis.service.js';
import { internalError } from '../../models/error.model.js';

export class S3PreferenceStorage implements GlobalPreferencesStorage {
	protected s3Service = S3Service.getInstance();
	protected redisService = RedisService.getInstance();
	protected logger = LoggerService.getInstance();
	private readonly PREFERENCES_PATH = '.call-preferences';
	private readonly PREFERENCES_KEY = 'call-preferences';

	async initialize(defaultPreferences: RoomPreferences): Promise<void> {
		const exist = await this.s3Service.exists(`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`);

		if (!exist) {
			this.logger.info('Saving default preferences to S3');
			await this.saveRoomPreferences(defaultPreferences);
		}
	}

	async getRoomPreferences(): Promise<RoomPreferences | null> {
		// Try fetching preferences from Redis
		let preferences: RoomPreferences | null = await this.getFromRedis(this.PREFERENCES_KEY);

		if (preferences) return preferences;

		// If preferences were not found in Redis, try fetching from S3
		preferences = await this.getFromS3(`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`);

		if (preferences) {
			// Save preferences to Redis for future use
			await this.redisService.set(this.PREFERENCES_KEY, JSON.stringify(preferences), false);
			return preferences;
		}

		// Return null if no preferences were found in Redis or S3
		return null;
	}

	async saveRoomPreferences(preferences: RoomPreferences): Promise<RoomPreferences> {
		try {
			await Promise.all([
				this.s3Service.saveObject(
					`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`,
					JSON.stringify(preferences)
				),
				this.redisService.set(this.PREFERENCES_KEY, JSON.stringify(preferences), false)
			]);
			return preferences;
		} catch (error: any) {
			throw internalError(`Error updating preferences: ${error.message}`);
		}
	}

	protected async getFromRedis(key: string): Promise<any | null> {
		let preferencesCache: string | null = null;

		try {
			// Try to get preferences from Redis
			preferencesCache = await this.redisService.get(key);

			if (preferencesCache) {
				// Parse and return preferences if found in Redis
				return JSON.parse(preferencesCache) as RoomPreferences;
			}
		} catch (error: any) {
			// Log the error if necessary, but don't interrupt the flow
			this.logger.warn(`Error fetching preferences from Redis: ${error.message}`);
		}

		return null;
	}

	protected async getFromS3(path: string): Promise<any | null> {
		try {
			// If Redis didn't have the preferences, try fetching from S3
			const preferences = await this.s3Service.getObjectAsJson(path);

			if (preferences) {
				return preferences as RoomPreferences;
			}
		} catch (error: any) {
			// Log the error in case of failure to fetch from S3
			this.logger.error(`Error fetching preferences from S3: ${error.message}`);
		}

		return null;
	}
}
