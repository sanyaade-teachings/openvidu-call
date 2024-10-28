import { Component, OnInit } from '@angular/core';
import { RoomPreferences } from '@openvidu/call-common-types';
import { GlobalPreferencesService, NotificationService } from '../../../services';
import { DynamicGridComponent, ToggleCardComponent } from '../../../components';

@Component({
	selector: 'ov-room-preferences',
	standalone: true,
	imports: [DynamicGridComponent, ToggleCardComponent],
	templateUrl: './room-preferences.component.html',
	styleUrl: './room-preferences.component.scss'
})
export class RoomPreferencesComponent implements OnInit {
	private roomPreferences!: RoomPreferences;
	recordingEnabled = false;
	broadcastingEnabled = false;
	chatEnabled = false;
	backgroundsEnabled = false;

	constructor(
		private globalPreferencesService: GlobalPreferencesService,
		private notificationService: NotificationService
	) {}

	async ngOnInit() {
		try {
			await this.loadRoomPreferences();
		} catch (error) {
			console.error('Error fetching room preferences', error);
		}
	}

	async onRecordingToggle(enabled: boolean) {
		console.log('Recording toggled', enabled);

		try {
			this.roomPreferences.recordingPreferences.enabled = enabled;
			await this.globalPreferencesService.saveRoomPreferences(this.roomPreferences);
			this.recordingEnabled = enabled;

			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving recording preferences', error);
			// TODO: Show a toast message
		}
	}

	async onBroadcastingToggle(enabled: boolean) {
		console.log('Broadcasting toggled', enabled);

		try {
			this.roomPreferences.broadcastingPreferences.enabled = enabled;
			await this.globalPreferencesService.saveRoomPreferences(this.roomPreferences);
			this.broadcastingEnabled = enabled;
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving broadcasting preferences', error);
			// TODO: Show a toast message
		}
	}

	async onChatToggle(enabled: boolean) {
		console.log('Chat toggled', enabled);

		try {
			this.roomPreferences.chatPreferences.enabled = enabled;
			await this.globalPreferencesService.saveRoomPreferences(this.roomPreferences);
			this.chatEnabled = enabled;
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving chat preferences', error);
			// TODO: Show a toast message
		}
	}

	async onVirtualBackgroundToggle(enabled: boolean) {
		console.log('Virtual background toggled', enabled);

		try {
			this.roomPreferences.virtualBackgroundPreferences.enabled = enabled;
			await this.globalPreferencesService.saveRoomPreferences(this.roomPreferences);
			this.backgroundsEnabled = enabled;
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving virtual background preferences', error);
			// TODO: Show a toast message
		}
	}

	/**
	 * Loads the room preferences from the global preferences service and assigns them to the component's properties.
	 *
	 * @returns {Promise<void>} A promise that resolves when the room preferences have been loaded and assigned.
	 */
	private async loadRoomPreferences() {
		const preferences = await this.globalPreferencesService.getRoomPreferences();
		this.roomPreferences = preferences;

		console.log('Room preferences:', preferences);

		// Destructures the `preferences` object to extract the enabled status of various features.
		const {
			recordingPreferences: { enabled: recordingEnabled },
			broadcastingPreferences: { enabled: broadcastingEnabled },
			chatPreferences: { enabled: chatEnabled },
			virtualBackgroundPreferences: { enabled: backgroundsEnabled }
		} = preferences;

		// Assigns the extracted values to the component's properties.
		Object.assign(this, { recordingEnabled, broadcastingEnabled, chatEnabled, backgroundsEnabled });
	}
}
