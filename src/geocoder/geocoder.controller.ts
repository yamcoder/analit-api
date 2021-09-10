import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PharmaciesDto } from './dto/pharmacy.dto';

import { GeocoderService } from './geocoder.service';

@Controller()
export class GeocoderController {
	constructor(private readonly geocoderService: GeocoderService) {}

	@HttpCode(200)
	@Post('getPharmaciesWithPoint')
	getPharmaciesWithPoint(@Body() dto: PharmaciesDto) {
		return this.geocoderService.getPharmaciesWithPoint(dto);
	}
}
