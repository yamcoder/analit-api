import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AnalitService } from './analit/analit.service';
import { FindInPharmaciesDto } from './analit/dto/findInPharmacies.dto';
import { GeocoderService } from './geocoder/geocoder.service';

@Injectable()
export class AppService {
	constructor(
		private readonly analitService: AnalitService,
		private readonly geocoderService: GeocoderService,
	) {}

	getRoot(): string {
		return 'Analit API';
	}

	async getPharmaciesWithPointV2(dto: FindInPharmaciesDto) {
		const pharms = await firstValueFrom(
			this.analitService.findInPharmacies(dto),
		);
		return this.geocoderService.getPharmaciesWithPoint({ pharmacies: pharms });
	}
}
