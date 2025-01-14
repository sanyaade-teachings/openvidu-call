import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalPreferences, RoomPreferences } from '@typings-ce';
import { RecordingInfo } from 'openvidu-components-angular';
import { lastValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	// private baseHref: string;
	protected pathPrefix = 'call/api';

	constructor(protected http: HttpClient) {
		// this.baseHref = '/' + (!!window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] + '/' : '');
	}

	/**
	 * Retrieves the global preferences.
	 *
	 * @returns {Promise<GlobalPreferences>} A promise that resolves to the global preferences.
	 */
	getGlobalPreferences(): Promise<GlobalPreferences> {
		const headers = this.generateUserHeaders();
		return this.getRequest(`${this.pathPrefix}/preferences`, headers);
	}

	/**
	 * Retrieves the room preferences.
	 *
	 * @returns {Promise<RoomPreferences>} A promise that resolves to the room preferences.
	 */
	getRoomPreferences(): Promise<RoomPreferences> {
		const headers = this.generateUserHeaders();
		return this.getRequest(`${this.pathPrefix}/preferences/room`, headers);
	}

	/**
	 * Saves the room preferences.
	 *
	 * @param preferences - The room preferences to be saved.
	 * @returns A promise that resolves when the preferences have been successfully saved.
	 */
	saveRoomPreferences(preferences: RoomPreferences): Promise<any> {
		const headers = this.generateUserHeaders();
		return this.putRequest(`${this.pathPrefix}/preferences/room`, preferences, headers);
	}

	async getConfig() {
		return this.getRequest(`${this.pathPrefix}/config`);
	}

	getToken(roomName: string, participantName: string): Promise<{ token: string }> {
		const headers = this.generateUserHeaders();

		return this.postRequest(`${this.pathPrefix}/rooms`, { roomName, participantName }, headers);
	}

	adminLogin(body: { username: string; password: string }): Promise<{ message: string }> {
		return this.postRequest(`${this.pathPrefix}/admin/login`, body);
	}

	adminLogout(): Promise<{ message: string }> {
		return this.postRequest(`${this.pathPrefix}/admin/logout`, {});
	}

	userLogin(body: { username: string; password: string }): Promise<{ message: string }> {
		return this.postRequest(`${this.pathPrefix}/login`, body);
	}

	userLogout(): Promise<{ message: string }> {
		return this.postRequest(`${this.pathPrefix}/logout`, {});
	}

	getRecordings(continuationToken?: string): Promise<{ recordings: RecordingInfo[]; continuationToken: string }> {
		let path = `${this.pathPrefix}/admin/recordings`;

		if (continuationToken) {
			path += `?continuationToken=${continuationToken}`;
		}

		const headers = this.generateAdminHeaders();

		return this.getRequest(path, headers);
	}

	startRecording(roomName: string): Promise<RecordingInfo> {
		const headers = this.generateUserHeaders();

		return this.postRequest(`${this.pathPrefix}/recordings`, { roomName }, headers);
	}

	stopRecording(recordingId: string): Promise<RecordingInfo> {
		const headers = this.generateUserHeaders();
		return this.putRequest(`${this.pathPrefix}/recordings/${recordingId}`, {}, headers);
	}

	deleteRecording(recordingId: string): Promise<RecordingInfo> {
		const headers = this.generateUserHeaders();
		return this.deleteRequest(`${this.pathPrefix}/recordings/${recordingId}`, headers);
	}

	deleteRecordingByAdmin(recordingId: string): Promise<RecordingInfo> {
		const headers = this.generateAdminHeaders();
		return this.deleteRequest(`${this.pathPrefix}/admin/recordings/${recordingId}`, headers);
	}

	startBroadcasting(roomName: string, broadcastUrl: string): Promise<any> {
		const body = { roomName, broadcastUrl };
		const headers = this.generateUserHeaders();
		return this.postRequest(`${this.pathPrefix}/broadcasts/`, body, headers);
	}

	stopBroadcasting(broadcastId: string): Promise<any> {
		const headers = this.generateUserHeaders();
		return this.putRequest(`${this.pathPrefix}/broadcasts/${broadcastId}`, {}, headers);
	}

	protected postRequest(path: string, body: any, headers?: HttpHeaders): Promise<any> {
		try {
			return lastValueFrom(this.http.post<any>(path, body, { headers }));
		} catch (error: any) {
			if (error.status === 404) {
				throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
			}

			throw error;
		}
	}

	protected getRequest(path: string, headers?: HttpHeaders): any {
		try {
			return lastValueFrom(this.http.get(path, { headers }));
		} catch (error: any) {
			if (error.status === 404) {
				throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
			}

			throw error;
		}
	}

	protected deleteRequest(path: string, headers?: HttpHeaders) {
		try {
			return lastValueFrom(this.http.delete<any>(path, { headers }));
		} catch (error: any) {
			console.log(error);

			if (error.status === 404) {
				throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
			}

			throw error;
		}
	}

	protected putRequest(path: string, body: any = {}, headers?: HttpHeaders) {
		try {
			return lastValueFrom(this.http.put<any>(path, body, { headers }));
		} catch (error: any) {
			if (error.status === 404) {
				throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
			}

			throw error;
		}
	}

	protected generateUserHeaders(): HttpHeaders {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});

		return headers;
	}

	private generateAdminHeaders(): HttpHeaders {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		// TODO: Fix this
		const adminCredentials = undefined; // this.storageService.getAdminCredentials();

		if (!adminCredentials) {
			console.error('Admin credentials not found');
			return headers;
		}

		const { username, password } = adminCredentials;

		if (username && password) {
			return headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
		}

		return headers;
	}
}
