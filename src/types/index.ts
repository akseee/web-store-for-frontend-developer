// Слой данных
// Интерфейс для работы с данными, полученными с сервера
export interface ILarekAPI {
	getProductItem: (id: string) => Promise<ICard>;
	getProductList: () => Promise<ICard[]>;
	orderItems(order: IOrder): Promise<IOrderResults>;
}

// Интерфейс для модели данных страницы
export interface IAppState {
	list: ICard[];
	preview: string | null;
	basket: ICard[];
	order: IOrder | null;
	setCatalog(): void;
	setPreview(): void;
	toggleOrdereditem(): void;
	getTotal(): number;
	clearBasket(): void;
	validateOrder(): void;
}

// Работа с карточками
// Карточка
export interface ICard {
	id: string;
	title: string;
	price: number | null;
	description: string;
	image: string;
	category: CardCategory;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICardList {
	total: number;
	items: ICard[];
}

// Категория для карточки
export type CardCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'хард-скилл'
	| 'кнопка';

// Тип карточки для главной страницы
export type TCardPage = Pick<
	ICard,
	'id' | 'title' | 'price' | 'image' | 'category'
>;

// Тип карточки для корзины
export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;

// Корзина
export interface IBasket {
	items: TCardBasket[];
	sum: number | null;
}

// Заказ
export interface IOrder {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
}

// Тип оплаты заказа
export type PaymentMethod = 'онлайн' | '' | 'при получении';

// Тип для заказа с формой способа оплаты и адреса
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'> & {
	handlePaymentMethod(): void;
};

// Тип для заказа с формой почты и телефона
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

// Интерфейс выполнения успешной операции
export interface IOrderResults {
	id: string;
	total: number;
}

// Тип ошибок форм заказа
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Слой представления
// Интерфейс компонента страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Интерфейс компонента форм
export interface IForm {
	valid: boolean;
	errors: string[];
}

// Интерфейс компонента модального окна
export interface IModalData {
	content: HTMLElement;
	open(): void;
	close(): void;
}

// Интерфейс компонента успешного оформления заказа
export interface ISuccess {
	total: number;
}
export interface ISuccessActions {
	onClick: () => void;
}
