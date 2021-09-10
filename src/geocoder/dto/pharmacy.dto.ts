import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';

export class PharmacyDto {
	@IsNotEmpty()
	@IsString()
	pharmacyId: string;

	@IsString()
	address: string;
}

export class PharmaciesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => PharmacyDto)
	pharmacies: PharmacyDto[];
}
