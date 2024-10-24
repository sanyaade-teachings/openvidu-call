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
