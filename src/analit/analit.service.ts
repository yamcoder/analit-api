import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, forkJoin, of, Observable } from 'rxjs';
import * as FormData from 'form-data';

import { PAGE_SIZE, REGION, ANALIT_ENDPOINT } from './analit.constants';
import { parseDrugs, parsePharmacyDrugs } from './html-parser';
import { DrugModel, PharmacyDrugModel } from './models/analit.model';
import { FindDto } from './dto/find.dto';
import { FindInPharmaciesDto } from './dto/findInPharmacies.dto';

@Injectable()
export class AnalitService {
	constructor(private readonly httpService: HttpService) {}

	search({ query }: FindDto): Observable<DrugModel[]> {
		if (!query) return of([]);

		const formData = new FormData();
		formData.append('filter.query', query);
		formData.append('filter.region', REGION.Voronezh);

		return this.httpService
			.post<string>(ANALIT_ENDPOINT.searchResult, formData, {
				headers: formData.getHeaders(),
			})
			.pipe(map((response) => parseDrugs(response.data)));
	}

	findInPharmacies({
		catalogProducts,
		pharmacyCount,
	}: FindInPharmaciesDto): Observable<PharmacyDrugModel[]> {
		if (!catalogProducts) return of([]);

		const pages = Math.ceil(pharmacyCount / PAGE_SIZE);
		const requests = [];
		let page = 1;

		do {
			requests.push(this.findInPharmacyRequest(catalogProducts, page));
		} while (page++ <= pages);

		return forkJoin(requests).pipe(
			map((responseArray) =>
				responseArray
					.map((response) => parsePharmacyDrugs(response))
					.reduce((acc, cur) => acc.concat(cur), []),
			),
		);
	}

	private findInPharmacyRequest(catalogProducts: string, page: number) {
		const searchParams = new URLSearchParams();
		searchParams.append('catalogProducts', catalogProducts);
		searchParams.append('region', REGION.Voronezh);
		searchParams.append('page', String(page));
		searchParams.append('currentPage', String(page - 1));

		return this.httpService
			.post<string>(ANALIT_ENDPOINT.findInPharmacy, searchParams)
			.pipe(map((response) => response.data));
	}
}
