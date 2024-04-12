import { FormErrors, IAppState, ICard, IOrder } from '../types';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class Order implements IOrder {
	total: 0;
	items: [];
	email: '';
	phone: '';
	address: '';
	payment: 'онлайн';
}

export class AppState extends Model<IAppState> {
	catalog: ICard[] = [];
	basket: string[] = [];
	preview: string | null;
	order: IOrder = {
		total: 0,
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	formErrors: FormErrors = {};

	setCatalog(items: ICard[]) {
		items.forEach((item) => (this.catalog = [...this.catalog, item]));
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}
}
