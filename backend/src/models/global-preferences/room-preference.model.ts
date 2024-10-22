import { Column, DataType, Model, Table } from 'sequelize-typescript';
import {
	BroadcastingPreferences,
	ChatPreferences,
	RecordingPreferences,
	VirtualBackgroundPreferences
} from '@openvidu/call-common-types';

@Table({ tableName: 'room_preferences' })
export class RoomPreferencesModel extends Model {
	@Column({
		type: DataType.JSON,
		allowNull: false,
		defaultValue: {
			enabled: false
		}
	})
	recordingPreferences!: RecordingPreferences;

	@Column({
		type: DataType.JSON,
		allowNull: false,
		defaultValue: {
			enabled: false
		}
	})
	broadcastingPreferences!: BroadcastingPreferences;

	@Column({
		type: DataType.JSON,
		allowNull: false,
		defaultValue: {
			enabled: false
		}
	})
	chatPreferences!: ChatPreferences;

	@Column({
		type: DataType.JSON,
		allowNull: false,
		defaultValue: {
			enabled: false
		}
	})
	virtualBackgroundPreferences!: VirtualBackgroundPreferences;
}
