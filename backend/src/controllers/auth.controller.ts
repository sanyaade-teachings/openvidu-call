import { container } from '../config/dependency-injector.config.js';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { LoggerService } from '../services/logger.service.js';

export const login = (req: Request, res: Response) => {
	const logger = container.get(LoggerService);
	logger.verbose('Login request received');
	const { username, password } = req.body;

	if (!username || !password) {
		logger.warn('Missing username or password');
		return res.status(400).json({ message: 'Missing username or password' });
	}

	const authService = container.get(AuthService);
	const authenticated = authService.authenticateUser(username, password);

	if (!authenticated) {
		logger.warn('Login failed');
		return res.status(401).json({ message: 'Login failed' });
	}

	return res.status(200).json({ message: 'Login succeeded' });
};

export const logout = (req: Request, res: Response) => {
	return res.status(200).json({ message: 'Logout successful' });
};

export const adminLogin = async (req: Request, res: Response) => {
	const logger = container.get(LoggerService);
	logger.verbose('Admin login request received');
	const { username, password } = req.body;

	const authService = container.get(AuthService);
	const validationErrors = authService.validateCredentials(username, password);

	if (validationErrors.length > 0) {
		logger.warn('Validation errors:' + validationErrors);
		return res.status(400).json({ message: 'Invalid input', errors: validationErrors });
	}

	const authenticated = authService.authenticateAdmin(username, password);

	if (!authenticated) {
		logger.warn(`Admin login failed for username: ${username}`);
		return res.status(401).json({ message: 'Admin login failed. Invalid username or password' });
	}

	try {
		//TODO: Generate JWT token
		const jwtToken = await authService.generateAdminToken();
		res.cookie('ovCallAdminAuthToken', jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 1000
		});
		logger.info(`Admin login succeeded for username: ${username}`);
		return res.status(200).json({ message: 'Admin login succeeded' });
	} catch (error) {
		logger.error('Error generating admin token' + error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const adminLogout = (req: Request, res: Response) => {
	return res.status(200).json({ message: 'Logout successful' });
};
