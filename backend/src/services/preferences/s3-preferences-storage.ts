/**
 * Implements storage for preferences using S3.
 * This is used when the application is configured to operate in "s3" mode.
 */

import { RoomPreferences } from '@openvidu/call-common-types';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { S3Service } from '../s3.service.js';
import { LoggerService } from '../logger.service.js';

export class S3PreferenceStorage implements GlobalPreferencesStorage {
	protected s3Service = S3Service.getInstance();
	protected logger = LoggerService.getInstance();
	private readonly PREFERENCES_PATH = '.preferences';
	private readonly PREFERENCES_KEY = 'callPreferences';

	async initialize(): Promise<void> {
		const exist = await this.s3Service.exists(`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`);

		if (!exist) {
			this.logger.info('Saving default preferences to S3');
			await this.s3Service.saveObject(
				`${this.PREFERENCES_PATH}/${this.PREFERENCES_KEY}.json`,
				JSON.stringify({
					recordingPreferences: { enabled: true },
					broadcastingPreferences: { enabled: true },
					chatPreferences: { enabled: true },
					virtualBackgroundPreferences: { enabled: true }
				})
			);
		}
	}

	getRoomPreferences(): Promise<RoomPreferences | null> {
		throw new Error('Method not implemented.');
	}

	updateRoomPreferences(preferences: RoomPreferences): Promise<RoomPreferences> {
		throw new Error('Method not implemented.');
	}

	deleteRoomPreferences(): Promise<{ message: string }> {
		throw new Error('Method not implemented.');
	}
}
