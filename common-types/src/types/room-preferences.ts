export interface RoomPreferences {
	recordingPreferences: RecordingPreferences;
	broadcastingPreferences: BroadcastingPreferences;
	chatPreferences: ChatPreferences;
	virtualBackgroundPreferences: VirtualBackgroundPreferences;
}

export interface RecordingPreferences {
	enabled: boolean;
	// outputMode: string;
	// hasAudio: boolean;
	// hasVideo: boolean;
}

export interface BroadcastingPreferences {
	enabled: boolean;
}

export interface ChatPreferences {
	enabled: boolean;
}

export interface VirtualBackgroundPreferences {
	enabled: boolean;
}
