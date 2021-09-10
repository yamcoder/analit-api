import { IsNotEmpty, IsString } from 'class-validator';

export class FindDto {
	@IsNotEmpty()
	@IsString()
	query: string;
}
