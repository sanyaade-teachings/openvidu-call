import { Router } from 'express';
import bodyParser from 'body-parser';
import * as roomCtrl from '../controllers/room.controller.js';
import * as recordingCtrl from '../controllers/recording.controller.js';
import * as broadcastCtrl from '../controllers/broadcasting.controller.js';
import * as authCtrl from '../controllers/auth.controller.js';
import { getConfig } from '../controllers/global-preferences/global-preferences.controller.js';
import { healthCheck } from '../controllers/healthcheck.controller.js';
import { withAdminAndUserBasicAuth, withAdminBasicAuth, withUserBasicAuth } from '../services/auth.service.js';
import {
	getRoomPreferences,
	updateRoomPreferences
} from '../controllers/global-preferences/room-preferences.controller.js';
import {
	getAppearancePreferences,
	updateAppearancePreferences
} from '../controllers/global-preferences/appearance-preferences.controller.js';
import rateLimit from 'express-rate-limit';

const apiRouter = Router();
// Limit login attempts for avoiding brute force attacks
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 5,
	message: 'Too many login attempts, please try again later.'
});

apiRouter.use(bodyParser.urlencoded({ extended: true }));
apiRouter.use(bodyParser.json());

// Room Routes
apiRouter.post('/rooms', withUserBasicAuth, roomCtrl.createRoom);

// Recording Routes
apiRouter.post('/recordings', withUserBasicAuth, recordingCtrl.startRecording);
apiRouter.put('/recordings/:recordingId', withUserBasicAuth, recordingCtrl.stopRecording);
apiRouter.get('/recordings/:recordingId/stream', recordingCtrl.streamRecording);
apiRouter.delete('/recordings/:recordingId', withUserBasicAuth, recordingCtrl.deleteRecording);

apiRouter.get('/admin/recordings', withAdminBasicAuth, recordingCtrl.getAllRecordings);
apiRouter.delete('/admin/recordings/:recordingId', withAdminBasicAuth, recordingCtrl.deleteRecording);

// Broadcasting Routes
apiRouter.post('/broadcasts', withUserBasicAuth, broadcastCtrl.startBroadcasting);
apiRouter.put('/broadcasts/:broadcastId', withUserBasicAuth, broadcastCtrl.stopBroadcasting);

// Auth Routes
apiRouter.post('/login', authCtrl.login);
apiRouter.post('/logout', authCtrl.logout);
apiRouter.post('/admin/login', loginLimiter, authCtrl.adminLogin);
apiRouter.post('/admin/logout', authCtrl.adminLogout);

// Global Preferences Routes
// apiRouter.get('/preferences', /*withAdminBasicAuth,*/ getGlobalPreferences);

apiRouter.put('/preferences/room', /*withAdminBasicAuth,*/ updateRoomPreferences);
apiRouter.get('/preferences/room', /*withAdminBasicAuth,*/ getRoomPreferences);

apiRouter.put('/preferences/appearance', /*withAdminAndUserBasicAuth*/ updateAppearancePreferences);
apiRouter.get('/preferences/appearance', /*withAdminAndUserBasicAuth*/ getAppearancePreferences);

apiRouter.get('/config', getConfig); // TODO: remove this route

// Health Check Route
apiRouter.get('/healthcheck', withAdminAndUserBasicAuth, healthCheck);

export { apiRouter };
