import {
	FormErrors,
	ICard,
	IOrder,
	PaymentMethod,
	TOrderField,
} from '../types';
import { Model } from './base/Model';

// Интерфейс для модели данных страницы
export interface IAppState {
	list: ICard[];
	preview: string | null;
	basket: ICard[];
	order: IOrder | null;
}

export type CatalogChangeEvent = {
	catalog: ICard[];
};

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
		this.emitChanges('cards:change', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getButtonStatus(item: ICard) {
		return !this.basket.some((card) => card.id == item.id)
			? 'В корзину'
			: 'Убрать';
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

	getBasketTotal() {
		return this.basket.reduce((total, card) => total + card.price, 0);
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
		this.emitChanges('order:changed');
	}

	setBasketToOrder() {
		this.basket.forEach((card) => {
			this.order.items = [...(this.order.items + card.id)];
		});
		this.order.total = this.getBasketTotal();
	}

	setOrderPayment(value: PaymentMethod | null) {
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

	setCardsInOrder() {
		this.basket.forEach((card) => {
			this.order.items = [...this.order.items, card.id];
		});
		this.order.total = this.getBasketTotal();
	}

	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
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
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
