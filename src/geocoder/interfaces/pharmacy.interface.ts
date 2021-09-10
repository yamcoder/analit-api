import { PharmacyDto } from '../dto/pharmacy.dto';
import { PharmacyModel } from '../models/pharmacy.model';

export interface PharmacyWithPoint
	extends PharmacyDto,
		Pick<PharmacyModel, 'point'> {}
