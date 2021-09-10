import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { firstValueFrom, map, Observable } from 'rxjs';

import { PharmaciesDto } from './dto/pharmacy.dto';
import { PharmacyModel } from './models/pharmacy.model';
import { Point, GeocoderResponse } from './interfaces/geocoder.interface';
import { PharmacyWithPoint } from './interfaces/pharmacy.interface';
import { GEOCODER_ENDPOINT } from './geocoder.constants';

@Injectable()
export class GeocoderService {
	constructor(
		@InjectModel(PharmacyModel)
		private readonly pharmacyModel: ReturnModelType<typeof PharmacyModel>,
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

	async getPharmaciesWithPoint({
		pharmacies,
	}: PharmaciesDto): Promise<PharmacyWithPoint[]> {
		try {
			const result: PharmacyWithPoint[] = [];
			const lookupPharms = pharmacies.map((pharm) => pharm.pharmacyId);
			const existingPharms = await this.pharmacyModel
				.find(
					{
						pharmacyId: { $in: lookupPharms },
					},
					{ _id: 0 },
				)
				.exec();

			const existingPointsMap = new Map<string, Point>();
			const toInsertPharmsMap = new Map<string, PharmacyModel>();

			for (const pharm of existingPharms) {
				existingPointsMap.set(pharm.pharmacyId, pharm.point);
			}

			for (const pharm of pharmacies) {
				if (existingPointsMap.has(pharm.pharmacyId)) {
					result.push({
						...pharm,
						// eslint-disable-next-line
						point: existingPointsMap.get(pharm.pharmacyId)!,
					});
				} else {
					let retrievedPoint: Point;
					if (toInsertPharmsMap.has(pharm.pharmacyId)) {
						// eslint-disable-next-line
						retrievedPoint = toInsertPharmsMap.get(pharm.pharmacyId)?.point!;
					} else {
						retrievedPoint = await firstValueFrom(this.getPoint(pharm.address));
						toInsertPharmsMap.set(pharm.pharmacyId, {
							pharmacyId: pharm.pharmacyId,
							point: retrievedPoint,
						});
					}

					result.push({
						...pharm,
						point: retrievedPoint,
					});
				}
			}

			const pharmsToInsert = [...toInsertPharmsMap.values()];
			await this.pharmacyModel.insertMany(pharmsToInsert);

			return result;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			} else {
				throw new Error('PHARMACIES_WITH_POINT_ERROR');
			}
		}
	}

	private getPoint(address: string): Observable<Point> {
		return this.httpService
			.get<GeocoderResponse>(GEOCODER_ENDPOINT, {
				params: {
					q: `Воронеж, ${address}`,
					fields: 'items.point',
					key: this.configService.get('GEOCODER_KEY'),
				},
			})
			.pipe(
				map((response) => {
					if (response.data.result) {
						return response.data.result.items[0].point;
					} else {
						throw new Error(
							response.data.meta.error?.message ?? 'GET_POINT_ERROR',
						);
					}
				}),
			);
	}
}
