import { Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home/home.component';
import { VideoRoomComponent } from '@app/pages/video-room/video-room.component';
import { ConsoleComponent } from '@app/pages/console/console.component';
import { roomGuard } from '@app/guards/room.guard';
import { embeddedGuard } from '@app/guards/embedded.guard';
import { nonEmbeddedGuard } from '@app/guards/non-embedded.guard';
import { AppearanceComponent } from '@app/pages/console/appearance/appearance.component';
import { RoomPreferencesComponent } from '@app/pages/console/room-preferences/room-preferences.component';
import { AccessPermissionsComponent } from '@app/pages/console/access-permissions/access-permissions.component';
import { UnauthorizedComponent } from 'shared-call-components';
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
			{ path: 'appearance', component: AppearanceComponent },
			{ path: 'room-preferences', component: RoomPreferencesComponent },
			{ path: 'access-permissions', component: AccessPermissionsComponent }
		]
	},
	{ path: ':roomName', component: VideoRoomComponent, canActivate: [roomGuard] },
	{ path: 'unauthorized', component: UnauthorizedComponent }
];
