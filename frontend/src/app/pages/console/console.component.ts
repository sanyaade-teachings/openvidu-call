import { Component } from '@angular/core';
import { ConsoleNavComponent, ConsoleNavLink } from 'shared-call-components';

@Component({
	selector: 'app-console',
	standalone: true,
	imports: [ConsoleNavComponent],
	templateUrl: './console.component.html',
	styleUrl: './console.component.scss'
})
export class ConsoleComponent {
	navLinks: ConsoleNavLink[] = [
		{ label: 'Overview', route: '/', icon: 'dashboard' },
		{ label: 'Appearance', route: 'appearance', icon: 'palette' },
		{ label: 'Room Preferences', route: 'room-preferences', icon: 'video_settings' },
		{ label: 'Access & Permissions', route: 'access-permissions', icon: 'lock' }
		// { label: 'Security (PRO)', route: 'security', icon: 'security' },
		// { label: 'Integrations (PRO)', route: 'integrations', icon: 'integration_instructions' },
		// { label: 'Support', route: 'support', icon: 'support' },
		// { label: 'About', route: 'about', icon: 'info' }
	];

	constructor() {}

	logout() {
		console.log('logout');
	}
}
