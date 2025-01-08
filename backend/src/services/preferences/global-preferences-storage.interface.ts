import { RoomPreferences } from '@openvidu/call-common-types';

export interface GlobalPreferencesStorage {

	initialize(): Promise<void>;
	getRoomPreferences(): Promise<RoomPreferences | null>;
	updateRoomPreferences(preferences: RoomPreferences): Promise<RoomPreferences>;
	deleteRoomPreferences(): Promise<{ message: string }>;
}
