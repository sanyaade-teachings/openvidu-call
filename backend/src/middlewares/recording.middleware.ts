import { Request, Response, NextFunction } from 'express';
import { GlobalPreferencesService } from '../services/global-preferences.service.js';
import { RoomPreferences } from '@openvidu/call-common-types';
import { LoggerService } from '../services/logger.service.js';

export const withRecordingEnabled = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const preferences = await GlobalPreferencesService.getInstance().getRoomPreferences();

		if (preferences) {
			const { recordingPreferences } = preferences.value as RoomPreferences;

			if (!recordingPreferences.enabled) {
				return res.status(403).json({ message: 'Recording is disabled in this room.' });
			}

			return next();
		}

		LoggerService.getInstance().error('No room preferences found checking recording preferences. Refusing access.');
		return res.status(403).json({ message: 'Recording is disabled in this room.' });
	} catch (error) {
		LoggerService.getInstance().error('Error checking recording preferences:' + error);
		return res.status(403).json({ message: 'Recording is disabled in this room.' });
	}
};
