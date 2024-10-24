import { Component, OnInit } from '@angular/core';
import { RoomPreferences } from '@openvidu/call-common-types';
import { DynamicGridComponent, GlobalPreferencesService, ToggleCardComponent } from 'shared-call-components';

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

	constructor(private globalPreferencesService: GlobalPreferencesService) {}

	async ngOnInit() {
		try {
			this.roomPreferences = await this.globalPreferencesService.getRoomPreferences();

			console.log('Room preferences', this.roomPreferences);

			const { recordingPreferences, broadcastingPreferences, chatPreferences, virtualBackgroundPreferences } =
				this.roomPreferences;
			this.recordingEnabled = recordingPreferences.enabled;
			this.broadcastingEnabled = broadcastingPreferences.enabled;
			this.chatEnabled = chatPreferences.enabled;
			this.backgroundsEnabled = virtualBackgroundPreferences.enabled;
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
}
