import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/EventsEmitter";

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _sum: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._sum = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('');
			});
		}

		// this.items = [];
	}

	// set items(items: HTMLElement[]) {
	//   this
	// }

	// set sum(total: number) {
	//   this
	// }

	// get sum() {}
}
