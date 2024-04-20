import { FormErrors, ICard, IOrder, TOrderField } from '../types';
import { Model } from './base/Model';

export interface IAppState {
	list: ICard[];
	preview: string | null;
	basket: ICard[];
	order: IOrder | null;
}

export class AppState extends Model<IAppState> {
	catalog: ICard[] = [];
	basket: ICard[] = [];
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

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getButtonStatus(item: ICard) {
		if (item.price === null) {
			return 'Не для продажи';
		}
		if (!this.basket.some((card) => card.id == item.id)) {
			return 'Добавить в корзину';
		} else {
			return 'Убрать из корзины';
		}
	}

	toggleBasketCard(item: ICard) {
		return !this.basket.some((card) => card.id === item.id)
			? this.addCardToBasket(item)
			: this.deleteCardFromBasket(item);
	}

	addCardToBasket(item: ICard) {
		this.basket = [...this.basket, item];
		this.emitChanges('basket:changed');
	}

	deleteCardFromBasket(item: ICard) {
		this.basket = this.basket.filter((card) => card.id !== item.id);
		this.emitChanges('basket:changed');
	}

	getCardIndex(item: ICard) {
		return Number(this.basket.indexOf(item)) + 1;
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	clearOrder() {
		this.order = {
			total: 0,
			items: [],
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
	}

	setBasketToOrder() {
		this.order.items = this.basket.map((card) => card.id);
		this.order.total = this.getBasketTotal();
	}

	getBasketTotal() {
		return this.basket.reduce((total, card) => total + card.price, 0);
	}

	setOrderPayment(value: string) {
		this.order.payment = value;
	}

	setOrderAddress(value: string) {
		this.order.address = value;
	}

	setOrderPhone(value: string) {
		this.order.phone = value;
	}

	setOrderEmail(value: string) {
		this.order.email = value;
	}

	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = `Необходимо указать почту`;
		}
		if (!this.order.phone) {
			errors.phone = `Необходимо указать номер телефона`;
		}
		if (!this.order.address) {
			errors.address = `Необходимо указать адресс`;
		}
		if (!this.order.payment) {
			errors.payment = `Необходимо указать способ оплаты`;
		}

		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
