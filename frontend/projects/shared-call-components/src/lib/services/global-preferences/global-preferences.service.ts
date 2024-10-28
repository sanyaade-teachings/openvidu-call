import { Injectable } from '@angular/core';
import { AppearancePreferences, RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from 'openvidu-components-angular';
import { HttpService } from '../http/http.service';

@Injectable({
	providedIn: 'root'
})
// This service is used to store the global preferences of the application
export class GlobalPreferencesService {
	private log;
	// private globalPreferences: GlobalPreferences
	private roomPreferences!: RoomPreferences;
	private appearancePreferences: any;

	constructor(
		private loggerService: LoggerService,
		private httpService: HttpService
	) {
		this.log = this.loggerService.get('OVCall - GlobalPreferencesService');
	}

	async getRoomPreferences(): Promise<RoomPreferences> {
		if (!this.roomPreferences) {
			this.log.d('Room preferences not found, fetching from server');
			// Fetch the room preferences from the server
			this.roomPreferences = await this.httpService.getRoomPreferences();
		}

		return this.roomPreferences;
	}

	/**
	 * Saves the room preferences.
	 *
	 * @param {RoomPreferences} preferences - The preferences to be saved.
	 * @returns {Promise<void>} A promise that resolves when the preferences have been saved.
	 */
	async saveRoomPreferences(preferences: RoomPreferences): Promise<void> {
		this.log.d('Saving room preferences', preferences);
		await this.httpService.saveRoomPreferences(preferences);
		this.roomPreferences = preferences;
	}

	/**
	 * Retrieves the appearance preferences.
	 * If the preferences are not already loaded, it fetches them from the server.
	 *
	 * @returns {Promise<AppearancePreferences>} A promise that resolves to the appearance preferences.
	 */
	async getAppearancePreferences(): Promise<AppearancePreferences> {
		if (!this.roomPreferences) {
			this.log.d('Appearance preferences not found, fetching from server');
			this.appearancePreferences = await this.httpService.getAppearancePreferences();
		}

		return this.appearancePreferences;
	}

	/**
	 * Saves the appearance preferences.
	 *
	 * @param {AppearancePreferences} preferences - The preferences to be saved.
	 * @returns {Promise<void>} A promise that resolves when the preferences have been saved.
	 */
	async saveAppearancePreferences(preferences: AppearancePreferences): Promise<void> {
		this.log.d('Saving appearance preferences', preferences);
		await this.httpService.saveAppearancePreferences(preferences);
		this.appearancePreferences = preferences;
	}
}
