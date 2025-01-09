import { RoomPreferences } from '@openvidu/call-common-types';

/**
 * Interface for managing global preferences storage.
 */
export interface GlobalPreferencesStorage {
	/**
	 * Initializes the storage with default preferences if they are not already set.
	 *
	 * @param defaultPreferences - The default room preferences to initialize with.
	 * @returns A promise that resolves when the initialization is complete.
	 */
	initialize(defaultPreferences: RoomPreferences): Promise<void>;

	/**
	 * Retrieves the current room preferences.
	 *
	 * @returns A promise that resolves to the current room preferences, or null if not set.
	 */
	getRoomPreferences(): Promise<RoomPreferences | null>;

	/**
	 * Saves the given room preferences.
	 *
	 * @param preferences - The room preferences to save.
	 * @returns A promise that resolves to the saved room preferences.
	 */
	saveRoomPreferences(preferences: RoomPreferences): Promise<RoomPreferences>;
}
