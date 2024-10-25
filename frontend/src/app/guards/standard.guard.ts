import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { ApplicationMode, ContextService } from 'shared-call-components';

export const standardGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const contextService = inject(ContextService);
	const router = inject(Router);

	const isEmbedded = state.url.includes('embedded');

	if (isEmbedded) {
		const queryParams = { reason: 'embedded' };
		router.navigate(['unauthorized'], { queryParams });
		return false;
	}

	const tokenParameter = route.queryParams['token'];

	if (tokenParameter) {
		// Standard mode with token
		contextService.setApplicationMode(ApplicationMode.STANDARD_WITH_TOKEN);
		contextService.setToken(tokenParameter);
	} else {
		// Standard mode without token
		contextService.setApplicationMode(ApplicationMode.STANDARD);
		// As token is not provided, we need to get the room name from the URL
		const roomName = state.url.replace('/', '');
		contextService.setRoomName(roomName);
	}

	return true;
};
