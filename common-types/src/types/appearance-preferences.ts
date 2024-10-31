export interface AppearancePreferences {
	theme: ThemeOptions;
	advancedOptions?: AdvancedThemeOptions;
}

export enum ThemeOptions {
	DARK = 'dark',
	LIGHT = 'light',
	OPENVIDU = 'openvidu',
}

// If this has value, it will override the default theme
export interface AdvancedThemeOptions {
	colors?: CustomColors[];
	// styles: {
	// 	radius: {
	// 		button: string;
	// 		leaveButton: string;
	// 		video: string;
	// 		panel: string;
	// 	};
	// };
}

export interface CustomColors {
	label: string;
	key: string;
	value: string;
}
