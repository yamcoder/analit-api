import { HttpCode } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';

import { AnalitService } from './analit.service';
import { FindDto } from './dto/find.dto';
import { FindInPharmaciesDto } from './dto/findInPharmacies.dto';

@Controller()
export class AnalitController {
	constructor(private readonly analitService: AnalitService) {}

	@HttpCode(200)
	@Post('search')
	search(@Body() dto: FindDto) {
		return this.analitService.search(dto);
	}

	@HttpCode(200)
	@Post('findInPharmacies')
	findInPharmacies(@Body() dto: FindInPharmaciesDto) {
		return this.analitService.findInPharmacies(dto);
	}
}
