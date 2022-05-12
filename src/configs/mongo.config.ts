import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
	return {
		uri: getMongoString(configService),
	};
};

const getMongoString = (configService: ConfigService) =>
	`${configService.get('MONGODB_CLEVERCLOUD_URI')}`;

// const getMongoString = (configService: ConfigService) =>
// 	'mongodb+srv://' +
// 	configService.get('MONGO_LOGIN') +
// 	':' +
// 	configService.get('MONGO_PASSWORD') +
// 	'@' +
// 	configService.get('MONGO_HOST') +
// 	'/' +
// 	configService.get('MONGO_DATABASE');
