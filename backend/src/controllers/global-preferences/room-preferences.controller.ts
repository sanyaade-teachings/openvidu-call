import { container } from '../../config/dependency-injector.config.js';
import { Request, Response } from 'express';
import { LoggerService } from '../../services/logger.service.js';
import { GlobalPreferencesService } from '../../services/preferences/index.js';
import { OpenViduCallError } from '../../models/error.model.js';

export const updateRoomPreferences = async (req: Request, res: Response) => {
	const logger = container.get(LoggerService);

	logger.verbose(`Updating room preferences: ${JSON.stringify(req.body)}`);
	const roomPreferences = req.body;

	try {
		const preferenceService = container.get(GlobalPreferencesService);
		preferenceService.validateRoomPreferences(roomPreferences);

		const savedPreferences = await preferenceService.updateRoomPreferences(roomPreferences);

		return res
			.status(200)
			.json({ message: 'Room preferences updated successfully.', preferences: savedPreferences });
	} catch (error) {
		if (error instanceof OpenViduCallError) {
			logger.error(`Error saving room preferences: ${error.message}`);
			return res.status(error.statusCode).json({ name: error.name, message: error.message });
		}

		logger.error('Error saving room preferences:' + error);
		return res.status(500).json({ message: 'Error saving room preferences', error });
	}
};

export const getRoomPreferences = async (req: Request, res: Response) => {
	const logger = container.get(LoggerService);

	try {
		const preferenceService = container.get(GlobalPreferencesService);
		const preferences = await preferenceService.getRoomPreferences();

		if (!preferences) {
			return res.status(404).json({ message: 'Room preferences not found' });
		}

		return res.status(200).json(preferences);
	} catch (error) {
		if (error instanceof OpenViduCallError) {
			logger.error(`Error getting room preferences: ${error.message}`);
			return res.status(error.statusCode).json({ name: error.name, message: error.message });
		}

		logger.error('Error getting room preferences:' + error);
		return res.status(500).json({ message: 'Error fetching room preferences from database', error });
	}
};
