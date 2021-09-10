import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindInPharmaciesDto {
	@IsNotEmpty()
	@IsString()
	catalogProducts: string;

	@IsNumber()
	pharmacyCount: number;
}
