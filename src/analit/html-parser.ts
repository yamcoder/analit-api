import { JSDOM } from 'jsdom';
import { DrugModel, PharmacyDrugModel } from './models/analit.model';

export function parseDrugs(textHtml: string): DrugModel[] {
	const dom = new JSDOM(textHtml);
	const searchTable = dom.window.document.querySelector('#searchTable');

	if (searchTable) {
		const tbody = searchTable.children[1];
		const rows = tbody.querySelectorAll('tr[class$="tr"]');
		const drugs: DrugModel[] = [];

		rows.forEach((tr) => {
			const trCells = tr.children;

			const drug: DrugModel = {
				catalogProducts: trCells[0].children[0].getAttribute('value') ?? '',
				title: trCells[1].children[0].textContent ?? '',
				releaseForm: trCells[2].textContent ?? '',
				activeSubstance: trCells[4].textContent ?? '',
				price: parseDrugPrice(trCells[5].textContent ?? ''),
				pharmacyCount: parseInt(trCells[6].textContent ?? ''),
			};

			drugs.push(drug);
		});

		return drugs;
	}

	return [];
}

export function parsePharmacyDrugs(textHtml: string): PharmacyDrugModel[] {
	const dom = new JSDOM(textHtml);
	const drugResult = dom.window.document.querySelector('.drug_result');

	if (drugResult) {
		const tbody = drugResult.children[1];
		const rows = tbody.querySelectorAll('tr[class$="tr"]');
		const pharmacyDrugs: PharmacyDrugModel[] = [];

		rows.forEach((tr) => {
			const trCells = tr.children;
			const pharmacyDrug: PharmacyDrugModel = {
				pharmacyId: parseFirmId(
					trCells[0].children[0].getAttribute('href') ?? '',
				),
				pharmacyTitle: trCells[0].children[0].textContent ?? '',
				district: trCells[1].textContent ?? '',
				drugTitle: trCells[2].textContent ?? '',
				fabricator: trCells[3].textContent ?? '',
				price: parsePharmacyDrugPrice(trCells[4].textContent ?? ''),
				address: trCells[5].textContent ?? '',
				tel: parseTel(trCells[6].children[0].getAttribute('href') ?? ''),
			};

			pharmacyDrugs.push(pharmacyDrug);
		});

		return pharmacyDrugs;
	}

	return [];
}

function parseFirmId(textHref: string) {
	const href = textHref.replaceAll('&amp;', '&');
	const url = new URLSearchParams(href);
	return url.get('firmId') || '';
}

function parsePharmacyDrugPrice(price: string) {
	return parseFloat(price.replaceAll(',', '.'));
}

function parseTel(tel: string) {
	return tel.replaceAll('tel:', '');
}

function parseDrugPrice(price: string) {
	const prices = price.replaceAll(',', '.').split(' - ');
	const min = prices[0] ? parseFloat(prices[0]) : null;
	const max = prices[1] ? parseFloat(prices[1]) : null;
	return { min, max };
}
