import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from './logger.service.js';
import { RoomPreferencesModel } from '../models/global-preferences/room-preference.model.js';

export class GlobalPreferencseService {
	private logger = LoggerService.getInstance();
	protected static instance: GlobalPreferencseService;

	private constructor() {}

	static getInstance() {
		if (!GlobalPreferencseService.instance) {
			GlobalPreferencseService.instance = new GlobalPreferencseService();
		}

		return GlobalPreferencseService.instance;
	}

	async createRoomPreferences(roomPreferences: RoomPreferences) {
		return await RoomPreferencesModel.create({ roomPreferences });
	}

	async getRoomPreferences() {
		return await RoomPreferencesModel.findOne();
	}

	async updateRoomPreferences(roomPreferences: RoomPreferences) {
		try {
			const preferences = await this.getRoomPreferences();

			if (preferences) {
				await RoomPreferencesModel.update(roomPreferences, { where: { id: preferences.id } });
				return roomPreferences;
			} else {
				return await this.createRoomPreferences(roomPreferences);
			}
		} catch (error) {
			//TODO: Implement error handling
			throw error;
		}
	}

	async deleteRoomPreferences() {
		const preferences = await this.getRoomPreferences();

		if (preferences) {
			await preferences.destroy();
			return { message: 'Room preferences deleted successfully.' };
		} else {
			throw new Error('No preferences found to delete.');
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
