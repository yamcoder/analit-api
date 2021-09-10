export interface Point {
	lat: number;
	lon: number;
}

export interface Item {
	id: string;
	name: string;
	full_name: string;
	point: Point;
	type: string;
}

export interface GeocoderResponse {
	meta: {
		api_version: string;
		code: number;
		error?: {
			message: string;
			type: string;
		};
		issue_date: string;
	};
	result?: {
		items: Item[];
		total: number;
	};
}
