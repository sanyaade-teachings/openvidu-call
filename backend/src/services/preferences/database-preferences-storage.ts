/**
 * Implements storage for preferences using a database.
 * This is used when the application is configured to operate in "db" mode.
 */

import { RoomPreferences } from '@openvidu/call-common-types';
import { internalError } from '../../models/index.js';
import { LoggerService } from '../logger.service.js';
import { GlobalPreferencesModel } from './database-preference.model.js';
import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';

export class DatabasePreferenceStorage implements GlobalPreferencesStorage {
	protected logger = LoggerService.getInstance();

	async initialize(): Promise<void> {
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

	async getRoomPreferences(): Promise<RoomPreferences | null> {
		const roomPreferences = await this.getPreferences();
		return roomPreferences?.value as RoomPreferences;
	}

	async updateRoomPreferences(roomPreferences: RoomPreferences): Promise<RoomPreferences> {
		try {
			const preferences = await this.getRoomPreferences();

			if (preferences) {
				await GlobalPreferencesModel.update({ value: roomPreferences }, { where: { key: 'roomPreferences' } });
				return roomPreferences;
			}

			await GlobalPreferencesModel.create({
				key: 'roomPreferences',
				value: roomPreferences
			});
			return roomPreferences;
		} catch (error) {
			throw internalError('Error updating room preferences: ' + error);
		}
	}

	async deleteRoomPreferences(): Promise<{ message: string }> {
		try {
			const preferences = await this.getPreferences();

			if (preferences) {
				await preferences.destroy();
				return { message: 'Room preferences deleted successfully.' };
			}

			throw new Error('No preferences found to delete.');
		} catch (error) {
			throw internalError(`Error deleting room preferences: ${error}`);
		}
	}

	private getPreferences() {
		return GlobalPreferencesModel.findOne({ where: { key: 'roomPreferences' } });
	}
}
