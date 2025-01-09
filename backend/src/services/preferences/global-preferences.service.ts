/**
 * Service that provides high-level methods for managing application preferences,
 * regardless of the underlying storage mechanism.
 */

import { GlobalPreferences, RoomPreferences } from '@openvidu/call-common-types';
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
	 * Initializes default preferences if not already initialized.
	 * @returns {Promise<GlobalPreferences>} Default global preferences.
	 */
	async initializeDefaultPreferences(): Promise<GlobalPreferences> {
		const preferences = this.getDefaultPreferences();

		try {
			await this.storage.initialize(preferences);
			return preferences;
		} catch (error) {
			this.handleError(error, 'Error initializing default preferences');
			throw error;
		}
	}

	/**
	 * Retrieves the global preferences, initializing them if necessary.
	 * @returns {Promise<GlobalPreferences>}
	 */
	async getGlobalPreferences(): Promise<GlobalPreferences> {
		const preferences = await this.storage.getPreferences();

		if (preferences) return preferences;

		return await this.initializeDefaultPreferences();
	}

	/**
	 * Retrieves room preferences from global preferences.
	 * @returns {Promise<RoomPreferences>}
	 */
	async getRoomPreferences(): Promise<RoomPreferences> {
		const preferences = await this.getGlobalPreferences();
		return preferences.roomPreferences;
	}

	/**
	 * Updates room preferences in storage.
	 * @param {RoomPreferences} roomPreferences
	 * @returns {Promise<GlobalPreferences>}
	 */
	async updateRoomPreferences(roomPreferences: RoomPreferences): Promise<GlobalPreferences> {
		// TODO: Move validation to the controller layer
		this.validateRoomPreferences(roomPreferences);

		const existingPreferences = await this.getGlobalPreferences();
		existingPreferences.roomPreferences = roomPreferences;
		return this.storage.savePreferences(existingPreferences);
	}

	/**
	 * Resets room preferences to default values.
	 * @returns {Promise<GlobalPreferences>}
	 */
	async resetRoomPreferences(): Promise<GlobalPreferences> {
		const preferences = this.getDefaultPreferences();
		const existingPreferences = await this.getGlobalPreferences();
		existingPreferences.roomPreferences = preferences.roomPreferences;
		return this.storage.savePreferences(existingPreferences);
	}

	/**
	 * Validates the room preferences.
	 * @param {RoomPreferences} preferences
	 */
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

	/**
	 * Returns the default global preferences.
	 * @returns {GlobalPreferences}
	 */
	protected getDefaultPreferences(): GlobalPreferences {
		return {
			roomPreferences: {
				recordingPreferences: { enabled: true },
				broadcastingPreferences: { enabled: true },
				chatPreferences: { enabled: true },
				virtualBackgroundPreferences: { enabled: true }
			},
			appearancePreferences: {}
		};
	}

	/**
	 * Handles errors and logs them.
	 * @param {any} error
	 * @param {string} message
	 */
	protected handleError(error: any, message: string) {
		if (error instanceof OpenViduCallError) {
			this.logger.error(`${message}: ${error.message}`);
		} else {
			this.logger.error(`${message}: Unexpected error`);
		}
	}
}
