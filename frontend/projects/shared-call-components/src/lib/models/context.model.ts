export interface ContextData {
	roomName: string;
	participantName: string;
	token: string;
	decodedToken: any;
	mode: ApplicationMode;
	edition: Edition
}

export enum ApplicationMode {
	EMBEDDED = 'embedded',
	STANDARD = 'standard',
	STANDARD_WITH_TOKEN = 'standard_with_token'
}

export enum Edition {
	CE = 'ce',
	PRO = 'pro'
}
