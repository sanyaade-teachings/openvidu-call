import { ChangeDetectorRef, Component } from '@angular/core';
import { DynamicGridComponent, LogoCardComponent, ProFeatureCardComponent } from '../../../components';

@Component({
	selector: 'ov-appearance',
	standalone: true,
	imports: [DynamicGridComponent, LogoCardComponent, ProFeatureCardComponent],
	templateUrl: './appearance.component.html',
	styleUrl: './appearance.component.scss'
})
export class AppearanceComponent {
	constructor(protected cdr: ChangeDetectorRef) {}

	// async ngOnInit() {
	// 	try {
	// 		await this.loadAppearancePreferences();
	// 		this.cdr.detectChanges();
	// 	} catch (error) {}
	// }
}
