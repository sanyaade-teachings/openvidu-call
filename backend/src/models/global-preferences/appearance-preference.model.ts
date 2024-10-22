import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'appearance_preferences' })
export class AppearancePreferencesModel extends Model {
	@Column({
		type: DataType.STRING,
		defaultValue: 'default'
	})
	theme!: string;
}
