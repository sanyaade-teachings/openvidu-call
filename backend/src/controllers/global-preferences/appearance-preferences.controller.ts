import { Request, Response } from 'express';
import { AppearancePreferencesModel } from '../../models/global-preferences/appearance-preference.model.js';

export const updateAppearancePreferences = async (req: Request, res: Response) => {
	const { appearancePreferences } = req.body;

	try {
		const preferences = await AppearancePreferencesModel.findOne();

		if (preferences) {
			preferences.theme = appearancePreferences.theme;
			await preferences.save();
			return res.status(200).json({ message: 'Appearance preferences updated successfully.' });
		} else {
			await AppearancePreferencesModel.create({ appearancePreferences });
			return res.status(201).json({ message: 'Appearance preferences created successfully.' });
		}
	} catch (error) {
		console.error('Error saving appearance preferences:', error);
		return res.status(500).json({ message: 'Error saving appearance preferences', error });
	}
};

export const getAppearancePreferences = async (req: Request, res: Response) => {
	try {
		const preferences = await AppearancePreferencesModel.findOne();

		if (preferences) {
			return res.status(200).json(preferences);
		} else {
			return res.status(404).json({ message: 'Appearance preferences not found' });
		}
	} catch (error) {
		console.error('Error fetching appearance preferences:', error);
		return res.status(500).json({ message: 'Error fetching appearance preferences', error });
	}
};
