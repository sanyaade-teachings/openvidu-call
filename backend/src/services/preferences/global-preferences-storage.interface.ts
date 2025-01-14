import { GlobalPreferences } from '@typings-ce';

/**
 * Interface for managing global preferences storage.
 */
export interface GlobalPreferencesStorage<T extends GlobalPreferences = GlobalPreferences> {
	/**
	 * Initializes the storage with default preferences if they are not already set.
	 *
	 * @param defaultPreferences - The default preferences to initialize with.
	 * @returns A promise that resolves when the initialization is complete.
	 */
	initialize(defaultPreferences: T): Promise<void>;

	/**
	 * Retrieves the current preferences.
	 *
	 * @returns A promise that resolves to the current preferences, or null if not set.
	 */
	getPreferences(): Promise<T | null>;

	/**
	 * Saves the given preferences.
	 *
	 * @param preferences - The preferences to save.
	 * @returns A promise that resolves to the saved preferences.
	 */
	savePreferences(preferences: T): Promise<T>;
}
