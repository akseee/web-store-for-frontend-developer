import { TOrderContacts, TOrderPayment } from '../types';
import { IEvents } from './base/EventsEmitter';
import { Form } from './common/Form';

// @todo сделать оплату

export class OrderPayment extends Form<TOrderPayment> {
	protected _address: HTMLInputElement;
	protected buttonCash: HTMLButtonElement;
	protected buttonOnline: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._address = container.elements.namedItem('address') as HTMLInputElement;

		this.buttonOnline = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;

		this.buttonCash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this.buttonOnline) {
			this.buttonOnline.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonOnline.name,
					button: this.buttonOnline,
				});
			});
		}

		if (this.buttonCash) {
			this.buttonCash.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonCash.name,
					button: this.buttonCash,
				});
			});
		}
	}

	set address(value: string) {
		this._address.value = value;
	}

	togglePayment(value: HTMLElement) {
		this.clearPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	clearPayment() {
		this.toggleClass(this.buttonCash, 'button_alt-active', false);
		this.toggleClass(this.buttonOnline, 'button_alt-active', false);
	}
}

export class OrderContacts extends Form<TOrderContacts> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = container.elements.namedItem('email') as HTMLInputElement;
		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
	}
	set email(value: string) {
		this._email.value = value;
	}
	set phone(value: string) {
		this._phone.value = value;
	}
}
