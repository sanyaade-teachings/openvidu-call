import { Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home/home.component';
import { VideoRoomComponent } from '@app/pages/video-room/video-room.component';

import {
	RoomPreferencesComponent,
	AccessPermissionsComponent,
	AppearanceComponent,
	UnauthorizedComponent,
	ConsoleComponent,
	AboutComponent,
	SecurityPreferencesComponent,
	OverviewComponent,
	embeddedGuard,
	nonEmbeddedGuard,
	standardGuard
} from 'shared-call-components';
export const routes: Routes = [
	// Embedded mode
	{
		path: 'embedded',
		component: VideoRoomComponent,
		canActivate: [embeddedGuard]
	},
	{ path: 'embedded/unauthorized', component: UnauthorizedComponent },

	{ path: '', redirectTo: 'console', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, canActivate: [nonEmbeddedGuard] },
	{
		path: 'console',
		component: ConsoleComponent,
		canActivate: [nonEmbeddedGuard],
		children: [
			{ path: '', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'overview', component: OverviewComponent },
			{ path: 'access-permissions', component: AccessPermissionsComponent },
			{ path: 'appearance', component: AppearanceComponent },
			{ path: 'room-preferences', component: RoomPreferencesComponent },
			{ path: 'security-preferences', component: SecurityPreferencesComponent },
			{ path: 'about', component: AboutComponent }
		]
	},
	{ path: ':roomName', component: VideoRoomComponent, canActivate: [standardGuard, nonEmbeddedGuard] },
	{ path: 'unauthorized', component: UnauthorizedComponent },

	// Redirect all other routes to home
	{ path: '**', redirectTo: 'home' }
];
