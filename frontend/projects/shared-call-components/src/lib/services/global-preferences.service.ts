import { Injectable } from '@angular/core';
import { RoomPreferences } from '@openvidu/call-common-types';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
// This service is used to store the global preferences of the application
export class GlobalPreferencesService {
	// private globalPreferences: GlobalPreferences
	private roomPreferences!: RoomPreferences;

	// private roomPreferencesSubject = new Subject<RoomPreferences>();

	// Observable to notify changes in the room preferences
	// roomPreferences$ = this.roomPreferencesSubject.asObservable();

	constructor() {}

	setRoomPreferences(prefs: RoomPreferences) {
		this.roomPreferences = prefs;
		// this.roomPreferencesSubject.next(prefs);
	}

	getRoomPreferences(): RoomPreferences {
		return this.roomPreferences;
	}
}
