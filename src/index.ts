import './scss/styles.scss';
import { AppState } from './components/AppData';
import { BasketCard, Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/EventsEmitter';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { OrderContacts, OrderPayment } from './components/common/Order';
import { Success } from './components/common/Success';
import { ICard, IOrder } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppState({}, events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const modalWindow = ensureElement<HTMLElement>('#modal-container');
const pageBody = document.body;

const page = new Page(pageBody, events);
const modal = new Modal(modalWindow, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const paymentForm = new OrderPayment(cloneTemplate(paymentTemplate), events);
const contactForm = new OrderContacts(cloneTemplate(contacsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Инициализация каталога
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Инициализация или изменение элементов в каталоге
events.on('cards:changed', () => {
	page.counter = appData.basket.length;
	page.gallery = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:selected', item);
			},
		});
		return card.render(item);
	});
});

// Выбор карточки как элемент превью
events.on('card:selected', (item: ICard) => {
	appData.setPreview(item);
});

// Изменение превью
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', item);
			events.emit('preview:changed', item);
			modal.close();
		},
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: appData.getButtonStatus(item),
		}),
	});
});

// // Отправка карточки в корзину
events.on('card:basket', (item: ICard) => {
	appData.toggleBasketCard(item);
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// // Изменение данных корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
	basket.sum = appData.getBasketTotal();
	basket.items = appData.basket.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteCardFromBasket(basketCard);
			},
		});
		newBasketCard.index = appData.getCardIndex(basketCard);
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

// Открытие формы заказа
events.on('order:open', () => {
	modal.render({
		content: paymentForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей
events.on(
	/^order\..*:changed/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

// // Изменения в заказе
events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
	paymentForm.togglePayment(data.button);
	appData.setOrderPayment(data.payment);
	appData.validateOrder();
});

// // Подтверджение формы оплаты
events.on('order:submit', () => {
	modal.render({
		content: contactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Подтверджение формы контактов
events.on('contacts:submit', () => {
	appData.setBasketToOrder();
	api
		.orderItems(appData.order)
		.then((result) => {
			console.log(appData.basket, appData.order);
			const successWindow = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					appData.clearOrder();
				},
			});
			modal.render({ content: successWindow.render({ total: result.total }) });
		})
		.catch((err) => {
			console.error(`Ошибка выполнения заказа ${err}`);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	paymentForm.valid = !payment && !address;
	paymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactForm.valid = !email && !phone;
	contactForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Закрытие модального окна
events.on('modal:closed', () => {
	page.locked = false;
});
