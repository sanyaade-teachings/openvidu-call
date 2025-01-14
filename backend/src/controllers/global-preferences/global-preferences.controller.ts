import { Request, Response } from 'express';
import { CALL_PRIVATE_ACCESS } from '../../config.js';
import { LoggerService } from '../../services/logger.service.js';
import { GlobalPreferences } from '@typings-ce';

const logger = LoggerService.getInstance();

// export const getGlobalPreferences = async (req: Request, res: Response) => {
// 	logger.verbose('Getting global preferences');

// 	try {
// 		const [roomPreferences, appearancePreferences] = await Promise.all([
// 			RoomPreferencesModel.findOne(),
// 			AppearancePreferencesModel.findOne()
// 		]);

// 		const globalPreferences: GlobalPreferences = {
// 			roomPreferences: roomPreferences?.dataValues.roomPreferences,
// 			appearancePreferences: appearancePreferences?.dataValues.appearancePreferences
// 		};

// 		if (!globalPreferences) {
// 			return res.status(404).json({ message: 'Global preferences not found' });
// 		}

// 		return res.status(200).json(globalPreferences);
// 	} catch (error) {
// 		logger.error(`Unexpected error getting global preferences ${error}`);
// 		return res
// 			.status(500)
// 			.json({ name: 'Global Preferences Error', message: 'Unexpected error getting global preferences' });
// 	}
// };

// TODO: Remove this endpoint
export const getConfig = async (req: Request, res: Response) => {
	logger.verbose('Getting config');
	const response = { isPrivateAccess: CALL_PRIVATE_ACCESS === 'true' };
	return res.status(200).json(response);
};
