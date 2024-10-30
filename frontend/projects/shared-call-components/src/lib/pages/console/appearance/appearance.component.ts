import { ChangeDetectorRef, Component } from '@angular/core';
import { DynamicGridComponent, LogoCardComponent, SelectionCardComponent } from '../../../components';
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
		// theme: 'default',
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

	constructor(protected cdr: ChangeDetectorRef) {}

	async ngOnInit() {
		try {
			await this.loadAppearancePreferences();
			this.cdr.detectChanges();
		} catch (error) {}
	}

	async loadAppearancePreferences() {
		try {
			this.colorOptions = Array.from(this.appearancePreferences.colors!.keys()).map((key) => {
				return { label: key, value: this.appearancePreferences.colors!.get(key) as string };
			});
		} catch (error) {
			console.error(error);
		}
	}
}
