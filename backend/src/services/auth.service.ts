import {
	CALL_ADMIN_SECRET,
	CALL_ADMIN_USER,
	CALL_PRIVATE_ACCESS,
	CALL_SECRET,
	CALL_USER,
	LIVEKIT_API_KEY,
	LIVEKIT_API_SECRET
} from '../config.js';
import { AccessToken, AccessTokenOptions, TokenVerifier } from 'livekit-server-sdk';
import { injectable } from '../config/dependency-injector.config.js';

@injectable()
export class AuthService {
	constructor() {}

	generateAdminToken() {
		const options: AccessTokenOptions = {
			ttl: '1h',
			metadata: JSON.stringify({
				role: 'admin'
			})
		};
		const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, options);
		return at.toJwt();
	}

	async verifyToken(token: string) {
		const verifyer = new TokenVerifier(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
		return await verifyer.verify(token);
	}

	authenticateUser(username: string, password: string): boolean {
		if (CALL_PRIVATE_ACCESS === 'true') {
			return username === CALL_USER && password === CALL_SECRET;
		}

		return true;
	}

	// TODO: use hash and salt for password storage
	authenticateAdmin(username: string, password: string): boolean {
		return username === CALL_ADMIN_USER && password === CALL_ADMIN_SECRET;
	}

	validateCredentials(username: string, password: string): string[] {
		const errors: string[] = [];

		if (!username || username.length < 4) {
			errors.push('Username must be at least 4 characters long.');
		}

		if (!password || password.length < 4) {
			errors.push('Password must be at least 4 characters long.');
		}

		return errors;
	}
}
