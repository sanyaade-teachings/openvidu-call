/**
 * This model defines the structure and interactions with the "preferences" table
 * in the database. It is specifically used when the application operates in "db"
 * mode, where preferences are stored and retrieved directly from the database.
 *
 * The table stores key-value pairs, where the key represents a specific type of
 * preference (e.g., "roomPreferences", "appearancePreferences"), and the value
 * contains the associated configuration in JSON format.
 */

import { RoomPreferences, AppearancePreferences } from '@openvidu/call-common-types';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

type PreferencesMap = {
	roomPreferences: RoomPreferences;
	appearancePreferences: AppearancePreferences;
};

type PreferencesKey = keyof PreferencesMap;
type PreferencesValue<K extends PreferencesKey> = PreferencesMap[K];

@Table({ tableName: 'global_preferences' })
export class GlobalPreferencesModel<K extends PreferencesKey = PreferencesKey> extends Model {
	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true
	})
	declare key: K;

	@Column({
		type: DataType.JSON,
		allowNull: false
	})
	declare value: PreferencesValue<K>;
}
