import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from './logger.service.js';
import { GlobalPreferencesModel } from '../models/global-preferences.model.js';

export class GlobalPreferencseService {
	private logger = LoggerService.getInstance();
	protected static instance: GlobalPreferencseService;

	private constructor() {}

	/**
	 * Initializes the default global preferences if they do not already exist.
	 *
	 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
	 *
	 * @throws Will log an error if there is an issue accessing or modifying the database.
	 */
	initializeDefaultPreferences = async () => {
		try {
			const existingPreferences = await GlobalPreferencesModel.findAll();

			if (existingPreferences.length === 0) {
				await GlobalPreferencesModel.bulkCreate([
					{
						key: 'roomPreferences',
						value: {
							recordingPreferences: { enabled: true },
							broadcastingPreferences: { enabled: true },
							chatPreferences: { enabled: true },
							virtualBackgroundPreferences: { enabled: true }
						}
					},
					{
						key: 'appearancePreferences',
						value: {
							theme: 'light'
						}
					}
				]);

				this.logger.verbose('Default preferences initialized.');
			} else {
				this.logger.verbose('Preferences already initialized.');
			}
		} catch (error) {
			this.logger.error('Error initializing default preferences:' + JSON.stringify(error));
		}
	};

	static getInstance() {
		if (!GlobalPreferencseService.instance) {
			GlobalPreferencseService.instance = new GlobalPreferencseService();
		}

		return GlobalPreferencseService.instance;
	}

	getRoomPreferences(): Promise<GlobalPreferencesModel | null> {
		return GlobalPreferencesModel.findOne({ where: { key: 'roomPreferences' } });
	}

	async updateRoomPreferences(roomPreferences: RoomPreferences) {
		try {
			const preferences = await this.getRoomPreferences();

			if (preferences) {
				await GlobalPreferencesModel.update({ value: roomPreferences }, { where: { key: 'roomPreferences' } });
				return roomPreferences;
			} else {
				return await GlobalPreferencesModel.create({
					key: 'roomPreferences',
					value: roomPreferences
				});
			}
		} catch (error) {
			//TODO: Implement error handling
			throw error;
		}
	}

	async deleteRoomPreferences() {
		try {
			const preferences = await this.getRoomPreferences();

			if (preferences) {
				await preferences.destroy();
				return { message: 'Room preferences deleted successfully.' };
			} else {
				throw new Error('No preferences found to delete.');
			}
		} catch (error: any) {
			//TODO: Implement error handling
			throw new Error(`Error deleting room preferences: ${error.message}`);
		}
	}

	validatePreferences(preferences: RoomPreferences) {
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
