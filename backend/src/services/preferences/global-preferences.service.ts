/**
 * Service that provides high-level methods for managing application preferences,
 * regardless of the underlying storage mechanism.
 */

import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from '../logger.service.js';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { GlobalPreferencesStorageFactory } from './global-preferences.factory.js';
import { OpenViduCallError } from '../../models/error.model.js';

export class GlobalPreferencesService {
	protected logger = LoggerService.getInstance();
	protected static instance: GlobalPreferencesService;
	protected storage: GlobalPreferencesStorage;
	protected constructor() {
		this.storage = GlobalPreferencesStorageFactory.create();
		this.initializeDefaultPreferences();
	}

	static getInstance() {
		if (!GlobalPreferencesService.instance) {
			GlobalPreferencesService.instance = new GlobalPreferencesService();
		}

		return GlobalPreferencesService.instance;
	}

	/**
	 * Initializes the default preferences by calling the storage's initialize method.
	 * This method is asynchronous and should be awaited to ensure that the preferences
	 * are properly initialized before proceeding.
	 *
	 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
	 */
	async initializeDefaultPreferences(): Promise<void> {
		const preferences = this.getDefaultPreferences();

		try {
			await this.storage.initialize(preferences);
		} catch (error) {
			if (error instanceof OpenViduCallError) {
				this.logger.error('Error initializing default preferences' + error.message);
			} else {
				this.logger.error('Unexpected error initializing default preferences');
			}
		}
	}

	getRoomPreferences(): Promise<RoomPreferences | null> {
		return this.storage.getRoomPreferences();
	}

	async updateRoomPreferences(roomPreferences: RoomPreferences) {
		this.validateRoomPreferences(roomPreferences);
		return this.storage.saveRoomPreferences(roomPreferences);
	}

	async resetRoomPreferences(): Promise<RoomPreferences> {
		const preferences = this.getDefaultPreferences();
		return await this.storage.saveRoomPreferences(preferences);
	}

	validateRoomPreferences(preferences: RoomPreferences) {
		const { recordingPreferences, broadcastingPreferences, chatPreferences, virtualBackgroundPreferences } =
			preferences;

		if (!recordingPreferences || !broadcastingPreferences || !chatPreferences || !virtualBackgroundPreferences) {
			throw new Error('All room preferences must be provided');
		}

		if (typeof preferences.recordingPreferences.enabled !== 'boolean') {
			throw new Error('Invalid value for recordingPreferences.enabled');
		}

		if (typeof preferences.broadcastingPreferences.enabled !== 'boolean') {
			throw new Error('Invalid value for broadcastingPreferences.enabled');
		}

		if (typeof preferences.chatPreferences.enabled !== 'boolean') {
			throw new Error('Invalid value for chatPreferences.enabled');
		}

		if (typeof preferences.virtualBackgroundPreferences.enabled !== 'boolean') {
			throw new Error('Invalid value for virtualBackgroundPreferences.enabled');
		}
	}

	protected getDefaultPreferences(): RoomPreferences {
		return {
			recordingPreferences: { enabled: true },
			broadcastingPreferences: { enabled: true },
			chatPreferences: { enabled: true },
			virtualBackgroundPreferences: { enabled: true }
		};
	}
}
