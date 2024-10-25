import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from '../http/http.service';
import { ApplicationMode, ContextData, Edition } from '../../models/context.model';
import { LoggerService } from 'openvidu-components-angular';

@Injectable({
	providedIn: 'root'
})
/**
 * Service to manage the context of the application, including embedded mode and token management.
 */
export class ContextService {
	private context: ContextData = {
		roomName: '',
		participantName: '',
		token: '',
		decodedToken: {},
		mode: ApplicationMode.STANDARD,
		edition: Edition.CE
	};

	private log;

	/**
	 * Initializes a new instance of the ContextService class.
	 */
	constructor(
		private httpService: HttpService,
		private loggerService: LoggerService
	) {
		this.log = this.loggerService.get('OvCall - ContextService');
	}

	/**
	 * Sets the embedded mode of the application.
	 * @param isEmbedded - A boolean indicating whether the application is in embedded mode.
	 */
	setApplicationMode(mode: ApplicationMode): void {
		this.log.d('Setting application mode', mode);
		this.context.mode = mode;
	}

	/**
	 * Checks if the application is in embedded mode.
	 * @returns A boolean indicating whether the application is in embedded mode.
	 */
	isEmbeddedMode(): boolean {
		return this.context.mode === ApplicationMode.EMBEDDED;
	}

	isStandardMode(): boolean {
		return this.context.mode === ApplicationMode.STANDARD;
	}

	isStandardModeWithToken(): boolean {
		return this.context.mode === ApplicationMode.STANDARD_WITH_TOKEN;
	}

	/**
	 * Sets the token for the current session.
	 * @param token - A string representing the token.
	 */
	setToken(token: string): void {
		this.context.token = token;
		this.context.decodedToken = this.decodeJWTToken(token);
		this.setRoomName(this.context.decodedToken.video.room);
		this.setParticipantName(this.context.decodedToken.name);
		//TODO: do the same with permissions
		console.log('DECODED TOKEN----', this.context.decodedToken);
	}

	/**
	 * Retrieves a token for the current context.
	 *
	 * This method validates the token parameters and determines the mode of operation
	 * (embedded or standard) to handle the token accordingly.
	 *
	 * @returns {Promise<string>} A promise that resolves to the token string.
	 *
	 * @throws {Error} If the token parameters are invalid.
	 */
	async getToken(): Promise<string> {
		this.log.d('Getting token');
		const { roomName, participantName, token } = this.context;

		this.validateTokenParameters(roomName, participantName);

		if (this.isEmbeddedMode()) {
			return this.handleEmbeddedMode(token);
		}

		// Standard mode
		return this.handleStandardMode(token, roomName, participantName);
	}

	getRoomName(): string {
		return this.context.roomName;
	}

	setRoomName(roomName: string): void {
		this.context.roomName = roomName;
	}

	getParticipantName(): string {
		return this.context.participantName;
	}

	setParticipantName(participantName: string): void {
		this.context.participantName = participantName;
	}

	canRecord(): boolean {
		return this.context.decodedToken.metadata.permissions.canRecord;
	}

	canChat(): boolean {
		return this.context.decodedToken.metadata.permissions.canChat;
	}

	private validateTokenParameters(roomName: string, participantName: string): void {
		if (!roomName) {
			throw new Error('Error getting token, roomName is required');
		}
		if (!participantName) {
			throw new Error('Error getting token, participantName is required');
		}
	}

	private handleEmbeddedMode(token: string | undefined): string {
		this.log.d('Handling embedded mode');
		if (!token) {
			throw new Error('Token not found in embedded mode');
		}
		return token;
	}

	private async handleStandardMode(
		token: string | undefined,
		roomName: string,
		participantName: string
	): Promise<string> {
		this.log.d('Handling standard mode');
		if (token) {
			return token;
		}

		this.log.d('Requesting token to the server');
		const { token: newToken } = await this.httpService.getToken(roomName, participantName);
		this.setToken(newToken);
		return newToken;
	}

	private decodeJWTToken(token: string) {
		const decodedToken: any = jwtDecode(token);
		decodedToken.metadata = JSON.parse(decodedToken.metadata);
		return decodedToken;
	}
}
