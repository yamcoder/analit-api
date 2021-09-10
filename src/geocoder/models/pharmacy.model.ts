import { modelOptions, Prop } from '@typegoose/typegoose';

class Point {
	@Prop()
	lat: number;

	@Prop()
	lon: number;
}

@modelOptions({
	schemaOptions: {
		collection: 'Pharmacy',
		versionKey: false,
	},
})
export class PharmacyModel {
	@Prop({ required: true, unique: true })
	pharmacyId: string;

	@Prop({ type: () => Point, _id: false })
	point: Point;
}
