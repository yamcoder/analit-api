export class DrugModel {
	catalogProducts: string;
	title: string;
	releaseForm: string;
	activeSubstance: string;
	price: {
		min: number | null;
		max: number | null;
	};
	pharmacyCount: number;
}

export class PharmacyDrugModel {
	pharmacyId: string;
	pharmacyTitle: string;
	district: string;
	drugTitle: string;
	fabricator: string;
	price: number;
	address: string;
	tel: string;
}
