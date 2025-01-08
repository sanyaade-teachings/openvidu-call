/**
 * Factory class to determine and instantiate the appropriate preferences storage
 * mechanism (e.g., Database or S3), based on the configuration of the application.
 */

import { GlobalPreferencesStorage } from './global-preferences-storage.interface.js';
import { S3PreferenceStorage } from './s3-preferences-storage.js';
import { CALL_PREFERENCES_STORAGE_MODE } from '../../config.js';

export class GlobalPreferencesStorageFactory {
	static create(): GlobalPreferencesStorage {
		if (CALL_PREFERENCES_STORAGE_MODE === 's3') {
			return new S3PreferenceStorage();
		}

        throw new Error('Invalid preferences storage mode');
	}
}
