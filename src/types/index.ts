// Слой данных
// Интерфейс для работы с данными, полученными с сервера
export interface ILarekAPI {
	getProductItem: (id: string) => Promise<ICard>;
	getProductList: () => Promise<ICard[]>;
	orderItems(order: IOrder): Promise<IOrderResults>;
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
	button: string;
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
	payment: string;
}

// Тип оплаты заказа
export type PaymentMethod = 'онлайн' | '' | 'при получении';

// Тип для заказа с формой способа оплаты и адреса
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;

// Тип для заказа с формой почты и телефона
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type TOrderField = TOrderContacts & TOrderPayment;
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
}

// Интерфейс компонента успешного оформления заказа
export interface ISuccess {
	total: number;
}
export interface ISuccessActions {
	onClick: () => void;
}
