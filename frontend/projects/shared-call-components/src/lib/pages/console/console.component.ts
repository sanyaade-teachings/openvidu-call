import { Component } from '@angular/core';
import { ConsoleNavComponent } from '../../components/console-nav/console-nav.component';
import { ConsoleNavLink } from '../../models/sidenav.model';

@Component({
	selector: 'app-console',
	standalone: true,
	imports: [ConsoleNavComponent],
	templateUrl: './console.component.html',
	styleUrl: './console.component.scss'
})
export class ConsoleComponent {
	navLinks: ConsoleNavLink[] = [
		{ label: 'Overview', route: 'overview', icon: 'dashboard' },
		{ label: 'Access & Permissions', route: 'access-permissions', icon: 'lock' },
		{ label: 'Appearance', route: 'appearance', icon: 'palette' },
		{ label: 'Room Preferences', route: 'room-preferences', icon: 'video_settings' },
		{ label: 'Security', route: 'security-preferences', icon: 'security' },
		{ label: 'About', route: 'about', icon: 'info' }
	];

	constructor() {}

	logout() {
		console.log('logout');
	}
}
