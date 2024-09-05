# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

[Deploy](https://akseee.github.io/web-store-for-frontend-developer)

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/common/ — папка с компонентами

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базоваую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовком запроса  
**Методы**:

- `get` - выполняет `GET` запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр прни вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра вызова

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для орбаботки и в слоях приложения для генерации событий.  
**Методы**, реализуемые классом описаны интерфейсом 'IEvents':

- `on` - подписка на события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализуется требуемое в параметрах событие

Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков.

#### Класс Component

Абстрактный класс для создания переиспользуемых UI компонентов и предоставляет инструментарий для работы с DOM в дочерних компонентах. Является слоем представления.
**Методы**:

- `toggleClass` - переключает CSS-класс. Принимает HTML-элемент, название класса и опционально логическое значение принудительного добавления/удаления класса
- `setText` - устанавливает текстовое содержимое. Принимает HTML-элемент и текстовое содержимое
- `setDisabled` - устанавливает состояние блокировки. Принимает HTML-элемент и логическое значение, указывающее необходимость установки блокировки
- `setHidden` - скрывает указанный HTML-элемент, устанавливая его свойство display в 'none'
- `setVisible` - показывает указанный HTML-элемент, удаляя его свойство display
- `setImage` - устанавливает источник изображения и альтернативный текст. Принимает HTML-элемент, ссылку на изображение и оционально альтернативное название
- `render` - изображает компонент с опциональными данными и возвращает корневой контейнер.

#### Класс Model

Абстрактный класс представляет собой базовый механизм, предназначенный для работы с данными и управлениями изменениями. Его конструктор создает новый экземпляр модели с указанными данными и событиями, которые реализует `IEvents`. Является слоем данных.  
**Методы**:

- `emitChanges` - позволяет отправлять события с данными о изменениях необходимым компонентам или модулям.

### Слой данных

#### Класс AppData

Класс расширяет `Model`, который принимает интерфейс `IAppState`, и отвечает за хранение и логику работы с данными. В полях содержит свойства для хранения карточек каталога, предметов корзины, идентификатора открытого элемента, информации о заказе и ошибки формы.  
**Методы**:

- `setCatalog` - для получения каталога товаров
- `setPreview` - для предпросмотра товара
- `getButtonStatus` - для установки правильного текстового содержимого кнопки
- `toggleBasketCard` - для изменения статуса товара "в корзине" или "не в корзине". Использует внутренние методы `addCardToBasket` и `deleteCardFromBasket`
- `getBasketTotal` - для установки суммы корзины
- `getCardIndex` - для отображения нумерации товара в корзине
- `clearBasket` - очищает корзину от товаров. Отправляет событие об изменении
- `clearOrder` - очищает данные о заказе
- `setBasketToOrder` - добавляет массив товаров и сумму из корзины в заказ
- `setOrderPayment` - для самостоятельной установки способа заказа
- `setOrderAddress` - для самостоятельной установки адреса заказа
- `setOrderPhone` - для самостоятельной установки теелфона заказа
- `setOrderEmail` - для самостоятельной установки почты заказа
- `setOrderField` - для заполнения всех полей заказа
- `validateOrder` - проверка формы заказа о правильном заполнении полей форм. Отправляет событие об изменении

### Слой представления

Все классы представления отвечают за отображение внутри контейнера передаваемых в них данных. Главным родительским классом всех далее указанных классов является базовый компонент `Component<T>`, где `<T>` представляет используемый элементом интерфейс или тип. Все дочерние классы принимают в конструкторе _container_ в качестве HTML-элемента и _events_ для управления событиями.

#### Класс Modal

Класс на основе интерфейса `IModalData`, который представляет собой универсальный инструмент реализации модального окна, в котором меняется основной контент через шаблоны (карточка, корзина, формы).
Инициализирует элементы корзины, такие как кнопка закрытия и контент.
Устанавливает обработчики событий для уже найденной кнопки закрытия, клика за пределами окна и предотвращение закрытия при клике внутри контента.

**Свойства**:

- `content` - устанавливает содержимое модального окна, заменяя текущее содержимое новым

**Методы**:

- `open` - открывает модальное окно
- `close` - закрывает модальное окно
- `render` - сначала вызывает родительский метод `render`, которому передается содержание окна, затем открывается модальное окно и выводится его содержимое пользователю

#### Класс Page

Класс на основе интерфейса `IPage` является компонентом страницы и предоставляет методы для управления элементами страницы.
Имеет следующеие защищенные поля HTML-элементов: обертка страницы, отображение каталога с карточками, отображения корзины и количества товаров в нем. Добавляет слушатель при нажатии на иконку корзины.
**Свойства**:

- `counter` - устанавливает значение счетчика
- `catalog` - заменяет содержимое каталога новыми элементами.
- `locked` - управляет видимостью и доступностью элементов страницы, позволяя или запрещая пользовательские действия.

#### Класс Form

Класс на основе интерфейса `IForm` представляет собой компонент формы, который управляет визуальным представлением и состоянием форм.

Инициализирует кнопку подтверждения и поле ошибок у контейнера, а также добавляет слушатель событий у полей инпута форм, чтобы позволять валидировать поля.

Свойства:

- `valid` - устанавливает состояние кнопки в зависимости от валидности формы
- `errors` - устанавливает текст сообщения об ошибке в область для вывода ошибок формы.

**Методы**:

- `clearValue` - очищает поля формы
- `onInputChange` - защищенный метод, обрабатывает событие ввода данных в поля формы. Отправляет событие об изменении
- `render` - отрисовывает компонент на странице, устанавливает состояние формы, включая валидацию и список ошибок

#### Класс OrderPayment

Класс расширяет `Form` на основе типа `TOrderPayment`. В конструкторе инициализирует кнопки выбора способа оплаты для дальнейшнего использования в методе, а также поле адреса. Также устанавливается, что при активации кнопок оплаты ставится обработчик события и передаются выбранные данные.
**Свойства**:

- `address` - устанавливает адрес

**Методы**:

- `clearPayment` - убирает с кнопки класс активной
- `togglePayment` - очищает статус кнопок и устанавливает новую активную кнопку

#### Класс OrderContact

Класс расширяет `Form` на основе типа `TOrderContacts`. Инициализирует поля формы с почтой и телефоном.
**Свойства**:

- `email` - устанавливает почту
- `phone` - устанавливает номер телефона

#### Класс Success

Расширяет `Component` на освнове интерфейса `ISuccess`, появляется при успешном выполнении операций классов `OrderPayment` и `OrderContact` и отображает сообщение об успешном завершении заказа, а вторым параметром принимает обработчик события при закрытии окна.
Инициализирует поле текста для операции, кнопку и устанавливает ее слушатель событий.  
**Свойства**:

- `total` - устанавливает сумму заказа

#### Класс Basket

Класс представляет собой компонент корзины, который на основе интерфейса `IBasket`.
Инициализирует элементы списка элементов корзины, их заполненность, общую стоимость и устанавливает обработчик на кнопку для возможность перехода к оформлению заказа.  
**Свойства**:

- `items` - устанаваливает разметку элементов корзины
- `sum` - устанавливает сумму всех товаров

#### Класс Card

Класс представляет собой компонент краточки на основе интерфейса `ICard`, который содержит информацию о товаре. Конструктор принимает контейнер и объект actions типа `ICardActions`, который содержит действия, доступные для выполнения при взаимодействии с карточкой товара. Инициализирует элементы карточки.  
**Свойства**:

- `id` - устанавливается id для карточки
- `title` - устанавливает название карточки
- `description` - устанавливается описание карточки
- `price` - устанавливает цену карточки, при этом идет проверка - если с сервера цена `null`, то по ТЗ добавить в корзину ее нельзя и ее текст заменяется на _Бесценно_ . Также приводит цену к стандарту при помощи метода `formatNumber`
- `image` - устанавливает картинку для карточки
- `category` - устанавливает категорию карточки и добавляет класс в соответствии с текстовым содержимым
- `button` - меняет текст на кнопке

#### Класс BasketCard

Расширяет `Card`, который представляет собой другой вид карточки для корзины. В полях указываются номер карточки, название и новая кнопка удаления карточки из корзины.  
**Свойства**:

- `index` - устанавливает номер карточки по ее индеку

### Слой презентера

Веб-ларек является небольшим приложением и слоем представлением фактически будет тот код, который находится в корневом `src\index.ts`, где все соединяется через колбэки или события компоненты и API. Возможна полноценная реализация по мере разработки приложения.

## Данные и типы данных, используемые в приложении

Данные и типы данных, используемые в приложении, находятся в `src\types\index.ts`

## Описание событий

|        Событие         | Триггер                                                                                | Реакция                                                                                                                                                                                                                                |
| :--------------------: | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `cards:changed`     | Инициализация товаров, добавление товаров в галерею товаров                            | Обновляет счетчик корзины, устанавливает разметку товаров                                                                                                                                                                              |
|    `card:selected`     | Выбор карточки кликом в галерее                                                        | Устанавливает id карточки в превью модели и вызывает событие `preview:changed`                                                                                                                                                         |
|   `preview:changed`    | Выбор карточки кликом в галерее                                                        | Выводит или обновляет разметку выбранной карточки в открытом модальном окне, добавляет события на кнпоку карточки (`card:basket`, `preview:changed`)                                                                                   |
|      `modal:open`      | Клик по избранным элементам разметки (корзина, карточка, формы заказа, конец операции) | Запрещает пользовательские действия вне модального окна, открывает модальное окно                                                                                                                                                      |
|     `modal:closed`     | Нажатие на иконку закрытия у модального окна, клик вне модального окна                 | Разблокируем пользовательские действия, закрывает модальное окно                                                                                                                                                                       |
|     `basket:open`      | Нажатие на иконку корзины                                                              | Выводит разметку корзины                                                                                                                                                                                                               |
|    `basket:changed`    | Изменения в корзине (очистка корзины, добавление и удаление товаров)                   | Изменение счетки товаров в корзине на главной страницы, изменение суммы корзины, изменение разметки карточек в корзине                                                                                                                 |
|      `order:open`      | Нажатие по оформления в корзине                                                        | Открытие модального окна с разметкой первой части формы заказа с заблокированной кнопкой                                                                                                                                               |
|    `order:changed`     | Изменение выбора способа заказа                                                        | Устанавливает данные о способе оплаты в модель и валидирует поля                                                                                                                                                                       |
| `/^order\..*:changed/` | Слежение за каждым изменением инпутов поля форм                                        | Устанавливает данные о заказе в модель и валидирует поля                                                                                                                                                                               |
|     `order:submit`     | Нажатие по кнопке подтверждения в первой части заказа                                  | Открытие второй части заказа                                                                                                                                                                                                           |
|   `contacts:submit`    | Нажатие по кнопке подтверждения во второй части заказа                                 | Отправляет товары с корзины в заказ, отправляет данные на сервер, при успешном выполнении операции открывается разметка соответствующего окна, при нажатии кнопки которой происходит очистка данных коризны (`basket:change`) и заказа |
|  `formErrors:change`   | Незаполенные поля форм                                                                 | Вызывает текстовую ошибку и блокирует кнопку                                                                                                                                                                                           |


