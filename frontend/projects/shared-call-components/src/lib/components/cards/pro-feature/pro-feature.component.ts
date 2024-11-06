import { Component } from '@angular/core';
import { BaseCardComponent } from '../base-card/base-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'ov-pro-feature-card',
	standalone: true,
	imports: [BaseCardComponent, MatButtonModule],
	template: `
		<ov-base-card
			[disabled]="false"
			[title]="title"
			[description]="description"
			[icon]="icon"
			[iconUrl]="iconUrl"
			[iconBackgroundColor]="iconBackgroundColor"
		>
			<div class="pro-feature-content" card-content>
				<h3 class="pro-title">Upgrade to OpenVidu PRO</h3>
				<p class="pro-description">
					Unlock this feature by upgrading to a Pro account. You can upgrade your account and start using this
					feature.
				</p>
				<div class="pro-feature-button">
					<button mat-flat-button (click)="goToOpenVidu()">Upgrade to Pro</button>
				</div>
			</div>
		</ov-base-card>
	`,
	styles: `
		.pro-feature-content {
			padding: 25px;
			text-align: center;
		}
	`
})
export class ProFeatureCardComponent extends BaseCardComponent {
	goToOpenVidu() {
		window.open('https://openvidu.io/pricing/', '_blank');
	}
}
