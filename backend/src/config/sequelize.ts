import { Dialect } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config.js';

import { LoggerService } from '../services/logger.service.js';
import { RoomPreferencesModel } from '../models/global-preferences/room-preference.model.js';
import { AppearancePreferencesModel } from '../models/global-preferences/appearance-preference.model.js';

const models = [RoomPreferencesModel, AppearancePreferencesModel];
const options: SequelizeOptions = {
	database: DB_NAME,
	dialect: DB_DIALECT as Dialect,
	username: DB_USER,
	password: DB_PASSWORD,
	host: DB_HOST,
	models
};

const sequelize = new Sequelize(options);
sequelize.addModels(models);

const sequelizeSync = async () => {
	const logger = LoggerService.getInstance();

	try {
		await sequelize.sync();
		await initializeDefaultPreferences();
		logger.verbose('Database connected and models synced.');
	} catch (error) {
		logger.error(`Error initializing the ${DB_DIALECT} database: ${error}`);
		console.error(error);
	}
};

const initializeDefaultPreferences = async () => {
	const logger = LoggerService.getInstance();

	const [roomPreferences, appearancePreferences] = await Promise.all([
		RoomPreferencesModel.findOne(),
		AppearancePreferencesModel.findOne()
	]);

	if (!roomPreferences) {
		await RoomPreferencesModel.create();
	}

	if (!appearancePreferences) {
		await AppearancePreferencesModel.create();
	}

	logger.verbose('Default preferences initialized.');
};

export { sequelize, sequelizeSync };
