import { Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home/home.component';
import { VideoRoomComponent } from '@app/pages/video-room/video-room.component';
import { roomGuard } from '@app/guards/room.guard';
import { embeddedGuard } from '@app/guards/embedded.guard';
import { nonEmbeddedGuard } from '@app/guards/non-embedded.guard';

import {
	RoomPreferencesComponent,
	AccessPermissionsComponent,
	AppearanceComponent,
	UnauthorizedComponent,
	ConsoleComponent,
	AboutComponent,
	SecurityPreferencesComponent,
	OverviewComponent
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
	{ path: ':roomName', component: VideoRoomComponent, canActivate: [roomGuard] },
	{ path: 'unauthorized', component: UnauthorizedComponent }
];
