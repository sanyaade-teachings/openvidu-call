import { GlobalPreferences } from '@openvidu/call-common-types';

/**
 * Interface for managing global preferences storage.
 */
export interface GlobalPreferencesStorage {
	/**
	 * Initializes the storage with default preferences if they are not already set.
	 *
	 * @param defaultPreferences - The default preferences to initialize with.
	 * @returns A promise that resolves when the initialization is complete.
	 */
	initialize(defaultPreferences: GlobalPreferences): Promise<void>;

	/**
	 * Retrieves the current preferences.
	 *
	 * @returns A promise that resolves to the current preferences, or null if not set.
	 */
	getPreferences(): Promise<GlobalPreferences | null>;

	/**
	 * Saves the given preferences.
	 *
	 * @param preferences - The preferences to save.
	 * @returns A promise that resolves to the saved preferences.
	 */
	savePreferences(preferences: GlobalPreferences): Promise<GlobalPreferences>;
}
