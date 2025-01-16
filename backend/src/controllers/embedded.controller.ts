import { container } from '../config/dependency-injector.config.js';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service.js';
import { LiveKitService } from '../services/livekit.service.js';
import { TokenOptions } from '@typings-ce';

export const generateToken = async (req: Request, res: Response) => {
	const logger = container.get(LoggerService);

	try {
		const tokenOptions: TokenOptions = req.body;
		const { participantName, roomName } = tokenOptions;
		logger.verbose(`Token generation request received: ${JSON.stringify(req.body)}`);

		if (!participantName || !roomName) {
			logger.error('Parameters participantName and roomName are required');
			return res.status(400).json({ error: 'Parameters participantName and roomName are required' });
		}

		logger.verbose(`Generating token for ${participantName} in room ${roomName}`);
		const livekitService = container.get(LiveKitService);
		const token = await livekitService.generateToken(tokenOptions);

		return res.status(200).json({ token });
	} catch (error) {
		logger.error(`Error generating token: ${error}`);
		return res.status(500).json({ error: 'Error generating token' });
	}
};
