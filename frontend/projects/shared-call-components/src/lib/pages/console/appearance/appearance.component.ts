import { Component } from '@angular/core';
import { DynamicGridComponent, LogoCardComponent } from '../../..//components';

@Component({
	selector: 'ov-appearance',
	standalone: true,
	imports: [DynamicGridComponent, LogoCardComponent],
	templateUrl: './appearance.component.html',
	styleUrl: './appearance.component.scss'
})
export class AppearanceComponent {}
