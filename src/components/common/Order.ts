import { TOrderContacts, TOrderPayment } from "../../types";
import { Form } from "./Form";

export class OrderPayment extends Form<TOrderPayment> {
	// constructor(protected container: HTMLFormElement, protected events: IEvents) {
	// 	super(container, events);
	// }
	// set payment(value: PaymentMethod) {
	// 	this;
	// }
	// set address(value: string) {
	// 	this;
	// }
	// handlePaymentMethod(e: Event) {
	// 	console.log(e);
	// }
}

export class OrderContacts extends Form<TOrderContacts> {
	// constructor(protected container: HTMLFormElement, protected events: IEvents) {
	// 	super(container, events);
	// }
	// set email(value: string) {
	// 	this;
	// }
	// set phone(value: string) {
	// 	this;
	// }
}
