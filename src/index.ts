import { AppState, CatalogChangeEvent } from './components/AppData';
import { Card } from './components/Card';
import { LarekAPI } from './components/LarekAPI';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/EventsEmitter';
import './scss/styles.scss';
import { ICard } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Модель данных приложения

const appData = new AppState({}, events);

// Все шаблоны

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
// const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
// const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
// const contatcsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса

// Дальше идет бизнес-логика

// Поймали событие, сделали что нужно

events.on<CatalogChangeEvent>('cards:changed', () => {
	page.gallery = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

console.log(appData);
