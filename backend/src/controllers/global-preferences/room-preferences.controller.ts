// src/controllers/roomPreferences.controller.ts
import { Request, Response } from 'express';
import { RoomPreferencesModel } from '../../models/global-preferences/room-preference.model.js';
import { LoggerService } from '../../services/logger.service.js';
import { GlobalPreferencseService } from '../../services/global-preferences.service.js';
import { OpenViduCallError } from '../../models/error.model.js';

const logger = LoggerService.getInstance();
const preferenceService = GlobalPreferencseService.getInstance();

export const updateRoomPreferences = async (req: Request, res: Response) => {
	logger.verbose('Updating room preferences:' + JSON.stringify(req.body));
	const roomPreferences = req.body;

	try {
		preferenceService.validatePreferences(roomPreferences);

		const savedPreferences = await preferenceService.updateRoomPreferences(roomPreferences);

		return res
			.status(200)
			.json({ message: 'Room preferences updated successfully.', preferences: savedPreferences });

		// let preferences = await RoomPreferencesModel.findOne();

		// if (preferences) {
		// 	await RoomPreferencesModel.update({ chatPreferences }, { where: { id: preferences.id } });
		// 	return res.status(200).json({ message: 'Room preferences updated successfully.', preferences });
		// } else {
		// 	// Crear preferencias si no existen
		// 	preferences = await RoomPreferencesModel.create({
		// 		recordingPreferences,
		// 		broadcastingPreferences,
		// 		chatPreferences
		// 	});
		// 	return res.status(201).json({ message: 'Room preferences created successfully.', preferences });
		// }
	} catch (error) {
		if (error instanceof OpenViduCallError) {
			logger.error(`Error saving room preferences: ${error.message}`);
			return res.status(error.statusCode).json({ name: error.name, message: error.message });
		}

		console.error('Error saving room preferences:', error);
		return res.status(500).json({ message: 'Error saving room preferences', error });
	}
};

export const getRoomPreferences = async (req: Request, res: Response) => {
	try {
		const preferences = await preferenceService.getRoomPreferences();

		if (!preferences) {
			return res.status(404).json({ message: 'Room preferences not found' });
		}

		return res.status(200).json(preferences);
	} catch (error) {
		console.error('Error fetching room preferences:', error);
		return res.status(500).json({ message: 'Error fetching room preferences', error });
	}
};
