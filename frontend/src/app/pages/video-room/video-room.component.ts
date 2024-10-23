import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import {
	BroadcastingStartRequestedEvent,
	BroadcastingStopRequestedEvent,
	RecordingDeleteRequestedEvent,
	RecordingStartRequestedEvent,
	RecordingStopRequestedEvent,
	OpenViduComponentsModule,
	ApiDirectiveModule
} from 'openvidu-components-angular';

import { ContextService, HttpService } from 'shared-call-components';
import {
	BroadcastingPreferences,
	ChatPreferences,
	RecordingPreferences,
	RoomPreferences,
	VirtualBackgroundPreferences
} from '@openvidu/call-common-types';

@Component({
	selector: 'app-video-room',
	templateUrl: './video-room.component.html',
	styleUrls: ['./video-room.component.scss'],
	standalone: true,
	imports: [OpenViduComponentsModule, ApiDirectiveModule, MatIcon]
})
export class VideoRoomComponent implements OnInit {
	roomName = '';
	token = '';
	isSessionAlive = false;
	serverError = '';
	loading = true;

	private roomPreferences!: RoomPreferences;
	chatPreferences: ChatPreferences = { enabled: true };
	recordingPreferences: RecordingPreferences = { enabled: true };
	broadcastingPreferences: BroadcastingPreferences = { enabled: true };
	virtualBackgroundPreferences: VirtualBackgroundPreferences = { enabled: true };
	showActivityPanel = true;
	showPrejoin = true;
	showChat = true;
	showRecording = true;

	constructor(
		private httpService: HttpService,
		private router: Router,
		private route: ActivatedRoute,
		private contextService: ContextService,
		private cdr: ChangeDetectorRef
	) {}

	async ngOnInit() {
		try {
			const { chatPreferences, recordingPreferences, broadcastingPreferences, virtualBackgroundPreferences } =
				await this.httpService.getRoomPreferences();

			this.chatPreferences = chatPreferences;
			this.recordingPreferences = recordingPreferences;
			this.broadcastingPreferences = broadcastingPreferences;
			this.virtualBackgroundPreferences = virtualBackgroundPreferences;

			this.showChat = chatPreferences.enabled;
			this.showRecording = recordingPreferences.enabled;
			this.showActivityPanel = recordingPreferences.enabled || broadcastingPreferences.enabled;

			if (this.contextService.isEmbeddedMode()) {
				// If global preferences are available, check if participant has permissions

				if (this.showChat) this.showChat = this.contextService.canChat();

				if (this.showRecording) this.showRecording = this.contextService.canRecord();

				this.showPrejoin = false;
				this.roomName = this.contextService.getRoomName();
				// this.isSessionAlive = true;
				// this.loading = false;
				return;
			} else {
				this.route.params.subscribe((params: Params) => {
					this.roomName = params['roomName'];
				});
			}
		} catch (error) {
			console.error('Error fetching room preferences', error);
		}
	}

	async onTokenRequested(participantName: string) {
		if (this.contextService.isEmbeddedMode()) {
			this.token = this.contextService.getToken();
			this.loading = false;
			this.cdr.detectChanges();
		} else {
			// Standard mode
			try {
				const { token } = await this.httpService.getToken(this.roomName, participantName);
				this.token = token;
			} catch (error: any) {
				console.error(error);
				this.serverError = error.error;
			} finally {
				this.loading = false;
			}
		}
	}

	onRoomDisconnected() {
		if (this.contextService.isEmbeddedMode()) {
			console.error('Embedded mode is not implemented');
			return;
		}

		this.isSessionAlive = false;
		console.log('onLeaveButtonClicked');
		this.router.navigate([`/`]);
	}

	async onRecordingStartRequested(event: RecordingStartRequestedEvent) {
		try {
			const { roomName } = event;
			await this.httpService.startRecording(roomName);
		} catch (error) {
			console.error(error);
		}
	}

	async onRecordingStopRequested(event: RecordingStopRequestedEvent) {
		try {
			const { recordingId } = event;

			if (!recordingId) throw new Error('Recording ID not found when stopping recording');

			await this.httpService.stopRecording(recordingId);
		} catch (error) {
			console.error(error);
		}
	}

	async onRecordingDeleteRequested(event: RecordingDeleteRequestedEvent) {
		try {
			const { recordingId } = event;

			if (!recordingId) throw new Error('Recording ID not found when deleting recording');

			await this.httpService.deleteRecording(recordingId);
		} catch (error) {
			console.error(error);
		}
	}

	async onBroadcastingStartRequested(event: BroadcastingStartRequestedEvent) {
		try {
			const { roomName, broadcastUrl } = event;
			await this.httpService.startBroadcasting(roomName, broadcastUrl);
		} catch (error) {
			console.error(error);
		}
	}

	async onBroadcastingStopRequested(event: BroadcastingStopRequestedEvent) {
		try {
			const { broadcastingId } = event;
			await this.httpService.stopBroadcasting(broadcastingId);
		} catch (error) {
			console.error(error);
		}
	}
}
