/**
 * Implements storage for preferences using S3.
 * This is used when the application is configured to operate in "s3" mode.
 */

import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';

export class S3PreferenceStorage implements GlobalPreferencesStorage {
	initialize(): Promise<void> {
		throw new Error('Method not implemented.');
	}

	getRoomPreferences(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	updateRoomPreferences(preferences: any): Promise<any> {
		throw new Error('Method not implemented.');
	}

	deleteRoomPreferences(): Promise<any> {
		throw new Error('Method not implemented.');
	}
}
