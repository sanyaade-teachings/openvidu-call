import { ChangeDetectorRef, Component } from '@angular/core';
import { DynamicGridComponent, LogoCardComponent, SelectionCardComponent } from '../../../components';
import { GlobalPreferencesService } from '../../../services';
import { AppearancePreferences } from '@openvidu/call-common-types';

@Component({
	selector: 'ov-appearance',
	standalone: true,
	imports: [DynamicGridComponent, LogoCardComponent, SelectionCardComponent],
	templateUrl: './appearance.component.html',
	styleUrl: './appearance.component.scss'
})
export class AppearanceComponent {
	appearancePreferences: AppearancePreferences = {
		theme: 'default',
		colors: new Map<string, string>([
			['primary', '#303030'],
			['secondary', '#3e3f3f'],
			['tertiary', '#598eff'],
			['warn', '#eb5144'],
			['accent', '#ffae35'],
			['light', '#e6e6e6'],
			['text', '#ffffff'],
			['textPanels', '#1d1d1d'],
			['backgroundPanel', '#ffffff']
		])
	};
	colorOptions: { label: string; value: string }[] = [];

	constructor(private globalPreferencesService: GlobalPreferencesService, private cdr: ChangeDetectorRef) {}

	async ngOnInit() {
		try {
			await this.loadAppearancePreferences();
			this.cdr.detectChanges();
		} catch (error) {}
	}
	onColorChange(event: any) {
		console.log('color changed', event);
	}

	async loadAppearancePreferences() {
		try {
			this.appearancePreferences = await this.globalPreferencesService.getAppearancePreferences();
			if (this.appearancePreferences.colors) {
				this.colorOptions = Array.from(this.appearancePreferences.colors.keys()).map((key) => {
					return { label: key, value: this.appearancePreferences.colors!.get(key) as string };
				});
			}

		} catch (error) {
			console.error('Error fetching appearance preferences', error);
		}
		if (this.appearancePreferences.colors) {
			this.colorOptions = Array.from(this.appearancePreferences.colors.keys()).map((key) => {
				return { label: key, value: this.appearancePreferences.colors!.get(key) as string };
			});
		}
		console.log('colorOptions', this.colorOptions);

	}
}
