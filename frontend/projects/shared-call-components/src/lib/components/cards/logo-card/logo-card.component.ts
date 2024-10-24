import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'ov-logo-card',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatIconModule],
	templateUrl: './logo-card.component.html',
	styleUrl: './logo-card.component.scss'
})
export class LogoCardComponent {
	@Input() title: string = '';
	@Input() description: string = '';
	@Input() logoSrc: string = '';
	@Input() cardBackgroundColor: string = '#ffffff';
	@Input() isEnabled: boolean = true;

	isHovering: boolean = false;

	onMouseEnter() {
		if (this.isEnabled) {
			this.isHovering = true;
		}
	}

	onMouseLeave() {
		this.isHovering = false;
	}
}
