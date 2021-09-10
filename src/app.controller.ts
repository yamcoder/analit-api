import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { FindInPharmaciesDto } from './analit/dto/findInPharmacies.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getRoot(): string {
		return this.appService.getRoot();
	}

	@HttpCode(200)
	@Post('getPharmaciesWithPointV2')
	getPharmaciesWithPointV2(@Body() dto: FindInPharmaciesDto) {
		return this.appService.getPharmaciesWithPointV2(dto);
	}
}
