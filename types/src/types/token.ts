// export interface OpenViduDecodedToken {
// 	metadata: string;
// 	video: VideoGrant;
// }

export interface TokenOptions {
	roomName: string;
	participantName: string;
	permissions?: OpenViduPermissions;
}

export interface OpenViduPermissions {
	canRecord: boolean;
	canChat: boolean;
}
