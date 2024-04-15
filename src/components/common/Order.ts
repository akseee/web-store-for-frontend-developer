import { PaymentMethod, TOrderContacts, TOrderPayment } from '../../types';
import { IEvents } from '../base/EventsEmitter';
import { Form } from './Form';

// @todo сделать оплату

export class OrderPayment extends Form<TOrderPayment> {
	protected _address: HTMLInputElement;
	protected buttonCash: HTMLButtonElement;
	protected buttonCard: HTMLButtonElement;
	// protected _payment;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._address = container.elements.namedItem(
			'.address'
		) as HTMLInputElement;

		this.buttonCard = container.elements.namedItem(
			'.card'
		) as HTMLButtonElement;

		this.buttonCash = container.elements.namedItem(
			'.cash'
		) as HTMLButtonElement;
	}
	set payment(value: PaymentMethod) {
		//
	}
	set address(value: string) {
		this._address.value = value;
	}
	handlePaymentMethod(e: Event) {
		console.log(e);
	}
}

export class OrderContacts extends Form<TOrderContacts> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = container.elements.namedItem('.email') as HTMLInputElement;
		this._phone = container.elements.namedItem('.phone') as HTMLInputElement;
	}
	set email(value: string) {
		this._email.value = value;
	}
	set phone(value: string) {
		this._phone.value = value;
	}
}
