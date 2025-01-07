import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from './logger.service.js';
import { GlobalPreferencesModel } from '../models/global-preferences.model.js';
import { Request, Response, NextFunction } from 'express';

export const withRecordingEnabled = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const preferences = await GlobalPreferencesService.getInstance().getRoomPreferences();

		if (preferences) {
			const { recordingPreferences } = preferences.value as RoomPreferences;

			if (!recordingPreferences.enabled) {
				return res.status(403).json({ message: 'Recording is disabled in this room.' });
			}

			return next();
		}

		LoggerService.getInstance().error('No room preferences found checking recording preferences. Refusing access.');
		return res.status(403).json({ message: 'Recording is disabled in this room.' });
	} catch (error) {
		LoggerService.getInstance().error('Error checking recording preferences:' + error);
		return res.status(403).json({ message: 'Recording is disabled in this room.' });
	}
};

export const withBroadcastingEnabled = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const preferences = await GlobalPreferencesService.getInstance().getRoomPreferences();

		if (preferences) {
			const { broadcastingPreferences } = preferences.value as RoomPreferences;

			if (!broadcastingPreferences.enabled) {
				return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
			}

			return next();
		}

		LoggerService.getInstance().error('No room preferences found checking broadcasting preferences. Refusing access.');
		return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
	} catch (error) {
		LoggerService.getInstance().error('Error checking broadcasting preferences:' + error);
		return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
	}
};

export class GlobalPreferencesService {
	protected logger = LoggerService.getInstance();
	protected static instance: GlobalPreferencesService;

	protected constructor() {}

	static getInstance() {
		if (!GlobalPreferencesService.instance) {
			GlobalPreferencesService.instance = new GlobalPreferencesService();
		}

		return GlobalPreferencesService.instance;
	}

	/**
	 * Initializes the default global preferences if they do not already exist.
	 *
	 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
	 *
	 * @throws Will log an error if there is an issue accessing or modifying the database.
	 */
	async initializeDefaultPreferences() {
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
					}
				]);

				this.logger.verbose('Default preferences initialized.');
			} else {
				this.logger.verbose('Preferences already initialized.');
			}
		} catch (error) {
			this.logger.error('Error initializing default preferences:' + JSON.stringify(error));
		}
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
