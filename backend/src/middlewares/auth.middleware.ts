import { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';

import { AuthService } from '../services/auth.service.js';
import { CALL_ADMIN_SECRET, CALL_ADMIN_USER, CALL_PRIVATE_ACCESS, CALL_SECRET, CALL_USER } from '../environment.js';


// TODO: Implement the authMiddleware function
// const authService = AuthService.getInstance();
// export const withValidToken = async (req: Request, res: Response, next: NextFunction) => {
// 	console.log(req);
// 	const { username, password } = req.body;

// 	const token = req.cookies?.ovCallAdminAuthToken;

// 	if (!token) {
// 		return res.status(401).json({ message: 'No token provided' });
// 	}

// 	try {
// 		await authService.verifyToken(token);
// 		next();
// 	} catch (error) {
// 		return res.status(403).json({ message: 'Failed to authenticate token' });
// 	}
// };

// Configure basic auth middleware for user and admin access
export const withAdminAndUserBasicAuth = (req: Request, res: Response, next: NextFunction) => {
	if (CALL_PRIVATE_ACCESS === 'true') {
		// Configure basic auth middleware if access is private
		const basicAuthMiddleware = basicAuth({
			users: {
				[CALL_USER]: CALL_SECRET,
				[CALL_ADMIN_USER]: CALL_ADMIN_SECRET
			},
			challenge: true,
			unauthorizedResponse: () => 'Unauthorized'
		});
		return basicAuthMiddleware(req, res, next);
	} else {
		// Skip basic auth if access is public
		next();
	}
};

// Configure basic auth middleware for admin access
export const withAdminBasicAuth = basicAuth({
	users: {
		[CALL_ADMIN_USER]: CALL_ADMIN_SECRET
	},
	challenge: true,
	unauthorizedResponse: () => 'Unauthorized'
});

// Configure basic auth middleware for user access
export const withUserBasicAuth = (req: Request, res: Response, next: NextFunction) => {
	if (CALL_PRIVATE_ACCESS === 'true') {
		// Configure basic auth middleware if access is private
		const basicAuthMiddleware = basicAuth({
			users: {
				[CALL_USER]: CALL_SECRET
			},
			challenge: true,
			unauthorizedResponse: () => 'Unauthorized'
		});
		return basicAuthMiddleware(req, res, next);
	} else {
		// Skip basic auth if access is public
		next();
	}
};
