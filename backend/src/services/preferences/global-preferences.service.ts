/**
 * Service that provides high-level methods for managing application preferences,
 * regardless of the underlying storage mechanism.
 */

import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from '../logger.service.js';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { GlobalPreferencesStorageFactory } from './global-preferences.factory.js';

export class GlobalPreferencesService {
	protected logger = LoggerService.getInstance();
	protected static instance: GlobalPreferencesService;
	protected storage: GlobalPreferencesStorage;
	protected constructor() {
		this.storage = GlobalPreferencesStorageFactory.create();
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
		await this.storage.initialize();
	}

	getRoomPreferences(): Promise<RoomPreferences | null> {
		return this.storage.getRoomPreferences();
	}

	async updateRoomPreferences(roomPreferences: RoomPreferences) {
		this.validateRoomPreferences(roomPreferences);
		return this.storage.updateRoomPreferences(roomPreferences);
	}

	async deleteRoomPreferences(): Promise<{message: string}> {
		return this.storage.deleteRoomPreferences();
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
}
