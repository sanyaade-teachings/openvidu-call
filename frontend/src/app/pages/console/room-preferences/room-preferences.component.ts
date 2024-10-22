import { Component, OnInit } from '@angular/core';
import { RoomPreferences } from '@openvidu/call-common-types';
import {
	DynamicGridComponent,
	GlobalPreferencesService,
	HttpService,
	ToggleCardComponent
} from 'shared-call-components';

@Component({
	selector: 'ov-room-preferences',
	standalone: true,
	imports: [DynamicGridComponent, ToggleCardComponent],
	templateUrl: './room-preferences.component.html',
	styleUrl: './room-preferences.component.scss'
})
export class RoomPreferencesComponent implements OnInit {
	private roomPreferences: RoomPreferences;
	recordingEnabled = false;
	broadcastingEnabled = false;
	chatEnabled = false;
	backgroundsEnabled = false;

	constructor(
		private httpService: HttpService,
		private globalPreferencesService: GlobalPreferencesService
	) {}

	async ngOnInit() {
		try {
			this.roomPreferences = this.globalPreferencesService.getRoomPreferences();

			if (!this.roomPreferences) {
				console.log('Room preferences not found, fetching from server');
				this.roomPreferences = await this.httpService.getRoomPreferences();
			}

			console.log('Room preferences', this.roomPreferences);

			// Cache the room preferences in the global preferences service
			this.globalPreferencesService.setRoomPreferences(this.roomPreferences);
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

	async onRecordingToggle(checked: boolean) {
		this.recordingEnabled = checked;
		console.log('Recording toggled', this.recordingEnabled);

		try {
			this.roomPreferences.recordingPreferences.enabled = this.recordingEnabled;
			await this.httpService.saveRoomPreferences(this.roomPreferences);
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving recording preferences', error);
			// TODO: Show a toast message
			this.recordingEnabled = !this.recordingEnabled;
		}
	}

	async onBroadcastingToggle(checked: boolean) {
		this.broadcastingEnabled = checked;
		console.log('Broadcasting toggled', this.broadcastingEnabled);

		try {
			this.roomPreferences.broadcastingPreferences.enabled = this.broadcastingEnabled;
			await this.httpService.saveRoomPreferences(this.roomPreferences);
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving broadcasting preferences', error);
			// TODO: Show a toast message
			this.broadcastingEnabled = !this.broadcastingEnabled;
		}
	}

	async onChatToggle(checked: boolean) {
		this.chatEnabled = checked;
		console.log('Chat toggled', this.chatEnabled);

		try {
			this.roomPreferences.chatPreferences.enabled = this.chatEnabled;
			await this.httpService.saveRoomPreferences(this.roomPreferences);
			// TODO: Show a toast message
		} catch (error) {
			console.error('Error saving chat preferences', error);
			// TODO: Show a toast message
			this.chatEnabled = !this.chatEnabled;
		}
	}

	async onVirtualBackgroundToggle(checked: boolean) {
		console.log('Virtual background toggled', checked);
		this.backgroundsEnabled = checked;

		try {
			// TODO: Show a toast message
			this.roomPreferences.virtualBackgroundPreferences.enabled = checked;
			await this.httpService.saveRoomPreferences(this.roomPreferences);
		} catch (error) {
			console.error('Error saving virtual background preferences', error);
			// TODO: Show a toast message
			this.backgroundsEnabled = !this.backgroundsEnabled;
		}
	}
}
