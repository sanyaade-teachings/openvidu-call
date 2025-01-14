import { Request, Response, NextFunction } from 'express';
import { GlobalPreferencesService } from '../services/preferences/index.js';
import { RoomPreferences } from '@typings-ce';
import { LoggerService } from '../services/logger.service.js';

export const withBroadcastingEnabled = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const preferences: RoomPreferences | null = await GlobalPreferencesService.getInstance().getRoomPreferences();

		if (preferences) {
			const { broadcastingPreferences } = preferences;

			if (!broadcastingPreferences.enabled) {
				return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
			}

			return next();
		}

		LoggerService.getInstance().error(
			'No room preferences found checking broadcasting preferences. Refusing access.'
		);
		return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
	} catch (error) {
		LoggerService.getInstance().error('Error checking broadcasting preferences:' + error);
		return res.status(403).json({ message: 'Broadcasting is disabled in this room.' });
	}
};
