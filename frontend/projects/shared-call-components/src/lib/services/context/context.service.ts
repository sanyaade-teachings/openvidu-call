import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root'
})
/**
 * Service to manage the context of the application, including embedded mode and token management.
 */
export class ContextService {
	/**
	 * Indicates whether the application is in embedded mode.
	 */
	private embeddedMode: boolean = false;

	/**
	 * Stores the token for the current session.
	 */
	private token: string | null = null

	private decodedToken: any;

	/**
	 * Initializes a new instance of the ContextService class.
	 */
	constructor() {
		console.warn('CONTEXT SERVICE CONSTRUCTOR');
	}

	/**
	 * Sets the embedded mode of the application.
	 * @param isEmbedded - A boolean indicating whether the application is in embedded mode.
	 */
	setEmbeddedMode(isEmbedded: boolean): void {
		console.warn('SET EMBEDDED MODE', isEmbedded);
		this.embeddedMode = isEmbedded;
	}

	/**
	 * Checks if the application is in embedded mode.
	 * @returns A boolean indicating whether the application is in embedded mode.
	 */
	isEmbeddedMode(): boolean {
		console.log('GET EMBEDDED MODE', this.embeddedMode);
		return this.embeddedMode;
	}

	/**
	 * Sets the token for the current session.
	 * @param token - A string representing the token.
	 */
	setToken(token: string): void {
		this.token = token;
		this.decodeJWTToken(token);
	}

	/**
	 * Retrieves the token for the current session.
	 * @returns A string representing the token, or null if no token is set.
	 */
	getToken(): string {
		if(!this.token) {
			throw new Error("Token not set");

		}
		return this.token;
	}

	getRoomName(): string {
		return this.decodedToken.video.room;
	}

	getParticipantName(): string {
		return this.decodedToken.name;
	}

	canRecord(): boolean {
		return this.decodedToken.metadata.permissions.canRecord;
	}

	canChat(): boolean {
		return this.decodedToken.metadata.permissions.canChat;
	}

	private decodeJWTToken(token: string) {
		this.decodedToken = jwtDecode(token);
		this.decodedToken.metadata = JSON.parse(this.decodedToken.metadata);
		console.log('DECODED TOKEN----', this.decodedToken);
	}
}
