import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ContextService } from '../services';
import { ApplicationMode } from '../models';


export const embeddedGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const contextService = inject(ContextService);
	const router = inject(Router);

	const isRequestFromIframe = window.self !== window.top;

	if (!isRequestFromIframe) {
		// Redirect to the unauthorized page if the request is not from an iframe
		const queryParams = { reason: 'no-iframe' };
		router.navigate(['embedded/unauthorized'], { queryParams });
		return false;
	}

	const isEmbedded = state.url.includes('embedded');

	if (isEmbedded) {
		contextService.setApplicationMode(ApplicationMode.EMBEDDED);

		const tokenParameter = route.queryParams['token'];

		if (!tokenParameter) {
			// Redirect to the unauthorized page if the token is not provided
			const queryParams = { reason: 'no-token' };
			router.navigate(['embedded/unauthorized'], { queryParams });

			return false;
		}

		contextService.setToken(tokenParameter);
	}

	// Allow access to the requested page
	return true;
};
