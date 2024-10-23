import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateFn } from '@angular/router';
// import { ConfigService } from '@services/config.service';
// import { StorageAppService } from '@services/storage.service';
// import { HttpService } from '@services/http.service';

export const roomGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	// const configService = inject(ConfigService);
	// const storageService = inject(StorageAppService);
	// const restService = inject(HttpService);
	// const router = inject(Router);

	// try {
	// 	await configService.initialize();

	// 	if (configService.isPrivateAccess()) {
	// 		const userCredentials = storageService.getParticipantCredentials();

	// 		if (!userCredentials) {
	// 			router.navigate(['/']);
	// 			return false;
	// 		}

	// 		await restService.userLogin(userCredentials);
	// 		return true;
	// 	}
	// } catch (error) {
	// 	router.navigate(['/'], { queryParams: { roomName: state.url } });
	// 	return false;
	// }

	console.log('ROOM GUARD');
	return true;
};
