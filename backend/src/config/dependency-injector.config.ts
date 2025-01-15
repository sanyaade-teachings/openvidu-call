import { Container } from 'inversify';
import { AuthService } from '../services/auth.service.js';
import { BroadcastingService } from '../services/broadcasting.service.js';
import { GlobalPreferencesService, GlobalPreferencesStorageFactory } from '../services/index.js';
import { LivekitWebhookService } from '../services/livekit-webhook.service.js';
import { LiveKitService } from '../services/livekit.service.js';
import { LoggerService } from '../services/logger.service.js';
import { OpenViduWebhookService } from '../services/openvidu-webhook.service.js';
import { RecordingService } from '../services/recording.service.js';
import { RedisService } from '../services/redis.service.js';
import { RoomService } from '../services/room.service.js';
import { S3Service } from '../services/s3.service.js';
import { S3PreferenceStorage } from '../services/preferences/s3-preferences-storage.js';

const container: Container = new Container();

/**
 * Registers all necessary dependencies in the container.
 *
 * This function is responsible for registering services and other dependencies
 * that are required by the application. It ensures that the dependencies are
 * available for injection throughout the application.
 *
 */
const registerDependencies = () => {
	console.log('Registering CE dependencies');
	container.bind(LoggerService).toSelf().inSingletonScope();
	container.bind(AuthService).toSelf().inSingletonScope();
	container.bind(BroadcastingService).toSelf().inSingletonScope();
	container.bind(LiveKitService).toSelf().inSingletonScope();
	container.bind(RoomService).toSelf().inSingletonScope();
	container.bind(OpenViduWebhookService).toSelf().inSingletonScope();
	container.bind(RedisService).toSelf().inSingletonScope();
	container.bind(S3Service).toSelf().inSingletonScope();
	container.bind(RecordingService).toSelf().inSingletonScope();
	container.bind(LivekitWebhookService).toSelf().inSingletonScope();
	container.bind(GlobalPreferencesService).toSelf().inSingletonScope();

	container.bind(S3PreferenceStorage).toSelf().inSingletonScope();
	container.bind(GlobalPreferencesStorageFactory).toSelf().inSingletonScope();
};

export { injectable, inject } from 'inversify';
export { container, registerDependencies };
