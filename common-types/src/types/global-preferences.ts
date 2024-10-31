import { AppearancePreferences } from './appearance-preferences';
import { RoomPreferences } from './room-preferences';


export interface GlobalPreferences {
	roomPreferences: RoomPreferences;
	appearancePreferences: AppearancePreferences;
}
