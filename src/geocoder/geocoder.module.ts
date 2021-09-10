import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypegooseModule } from 'nestjs-typegoose';

import { GeocoderService } from './geocoder.service';
import { GeocoderController } from './geocoder.controller';
import { PharmacyModel } from './models/pharmacy.model';

@Module({
	imports: [
		ConfigModule,
		HttpModule,
		TypegooseModule.forFeature([PharmacyModel]),
	],
	controllers: [GeocoderController],
	providers: [GeocoderService],
	exports: [GeocoderService],
})
export class GeocoderModule {}
