import moment from 'moment'

const is2019 = (date) => moment(date).isSameOrAfter('2019-01-01')

export enum SalesStatisticSource {
  ANY = 0,
  EVA_DTS = 1,
  PAYMENTS = 2,
}

export enum RouteStatuses {
  PLANNED = 'planned', // планируется
  PERFORMED = 'performed', // выполняется
  DONE = 'done', // выполнен
  DRAFT = 'draft', // черновик
  OVERDUE = 'overdue', // просрочен
}

export enum OrganizationsPartnerStatus {
  SILVER = 'silver',
  GOLD = 'gold',
  PEACEDATA = 'peacedata',
}

export enum TaxReporting {
  ALL = 0,
  CASHLESS = 1,
  CASH = 2,
  NONE = 3,
}

export enum UserRole {
  ADMIN = 1,
  VENDING_OPERATOR = 2,
}

export enum Message {
  OK = 'Операция успешно выполнено',
  INVALID_DATA = 'Не верные данные',
  CAN_NOT_FOUND_USER = 'Пользователь не найден',
  DELETED_AUTOMATS = 'Автоматы успешно удалены',
  DELETED_AUTOMAT = 'Автомат успешно удален',
  CONFIRM_EMAIL = 'Пожалуйста, подтвердите свою почту',
  RETRY_SIGNUP = 'Зарегистрируйтесь повторно, для повторного подтверждение почты',
  NO_SETTING = 'Настройки не найдены',
  NO_AUTOMAT = 'Автоматы не найдены',
  NO_AUTOMATS = 'Автоматы не найдены',
  NO_APPLICATION = 'Заявка не найдена',
  NO_DOC = 'Документ не найден',
  IMG_ERR = 'Ошибка при обработке изображении',
  DELETED = 'Успешно удалено',
  DELETEDS = 'Успешно удалены',
  ACCESS_DENIED = 'Нет доступа',
  REQUEST_BANK_ALREADY_EXIST = 'Запрос к банку уже существует',
  SUCCESSFUL_UPDATED = 'Успешно изменено',
  SUCCESSFUL_UPDATEDS = 'Успешно изменены',
  AUTOMAT_NAME_EXISTS = 'Автомат с таким названием уже существует',
  GROUP_NAME_EXISTS = 'Группа с таким названием уже существует',
  CATEGORY_EXISTS = 'Категория с таким названием уже существует',
  SUB_CATEGORY_EXISTS = 'Подкатегория с таким названием уже существует',
  PRODUCT_EXISTS = 'Товар с таким названием уже существует',
  INGREDIENT_EXISTS = 'Ингредиент с таким названием уже существует',
  RECIPE_EXISTS = 'Рецепт с таким названием уже существует',
  SKU_EXISTS = 'Такой артикул уже существует',
  CUSTOMER_EXISTS = 'Извините, пользователь уже в системе',
  DELETED_APPLICATION = 'Завка успешно удалена',
  PASSWORD_NOT_MATCH = 'Текущий пароль не должен совподать с новым',
  DEVICE_NOT_FOUND = 'Устройство не найдено',
  NOT_CORRECT_NAME = 'Некорректное наименование',
  NOT_CORRECT_DATA = 'Некорректные данные',
  ROUTE_NOT_FOUND = 'Маршрут не найден',
  ROUTES_NOT_FOUND = 'Маршруты не найдены',
  USER_NOT_FOUND = 'Пользователь не найден',
  DONT_REPEAT_PASSWORD = 'Новый пароль не должен совпадать с текущим',
  PRODUCT_NOT_FOUND = 'Товар не найден',
  PRODUCT_CATEGORY_NOT_FOUND = 'Категория товара не найдена',
  DATA_NAME_EXISTS = 'Данные с таким названием уже существуют',
  DEVICE_ALREADY_IN_USE = 'Устройство используется в другом личном кабинете, необходимо сначала отвязать something cube от другого личного кабинета',
  ACCOUNT_NOT_FOUND = 'Аккаунт не найден',
  CUBE_DEVICE_CONFLICT = 'Устройство используется в другом личном кабинете',
}

export enum MainMode {
  MDB_EXE = 0,
  MDB = 1,
  EXE_MASTER = 2,
  POSE = 3,
  Pulse = 4,
  CafeCo = 5,
}

export enum ClientEnable {
  OFF = 0,
  CUSTOM = 1,
  VAVILON = 2,
}

export enum VMCAuditProtocol {
  DDCMP = 0,
  DEX = 1,
}
export enum CCAuditProtocol {
  DDCMP = 0,
  DEX = 1,
}

export enum KeypadDirection {
  OFF = 0,
  LEFT = 1,
  TOP = 2,
  RIGHT = 3,
  BOTTOM = 4,
}

export enum PosMode {
  COM = 0,
  SOCKET = 1,
}

export enum ServiceMenuStatus {
  OPEN_MENU = 1, // Открыть меню
  CLOSE_MENU = 2, // Закрыть меню
  RELOAD_DEVICE = 3, // Перезагрузить устройство
  RELOAD_MODEM = 4, // Перезагрузить модем
  UNTETHER_CUBE = 5, // Отвязать Cube от автомата
  MENU_OPENED = 6, // Меню открыт
  MENU_CLOSED = 7, // Меню закрыт
  DEVICE_RELOADED = 8, // Устройство перезагружено
  MODEM_RELOADED = 9, // Модем перезагружен
  CUBE_UNTETHERED = 10, // Cube отвязан от автомата
  LOGS_UPLOAD = 11, // Загрузить лог на HTTP сервер
  UPDATE_LOGGING = 12, // Изменить настройки логгирования
  UPDATE_ACQUIRING_CONFIGURATION = 13, // Обновить эквайринговую конфигурацию jpay
  UPLOAD_KCV = 14, // Загрузить ключи KCV jpay
  LOAD_MASTER_KEYS = 15, // Загрузить мастер-ключи jpay
  RELOAD_WORK_KEYS = 16, // Перезагрузить рабочие ключи jpa
}

export enum ServiceMenuStatusToCube {
  OPEN_MENU = ServiceMenuStatus.OPEN_MENU,
  CLOSE_MENU = ServiceMenuStatus.CLOSE_MENU,
  RELOAD_DEVICE = ServiceMenuStatus.RELOAD_DEVICE,
  RELOAD_MODEM = ServiceMenuStatus.RELOAD_MODEM,
  UNTETHER_CUBE = ServiceMenuStatus.UNTETHER_CUBE,
}

export const Regex = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  phone: /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
}

export const template = {
  confirmEmail: (url) =>
    `Здравствуйте. Мы получили запрос на регистрацию в личном кабинете something Cube. <br/>Пожалуйста, пройдите по ссылке для завершения регистрации: <a href="${url}">Ссылка</a>`,
  inviteUser: (url: string, discardUrl: string, name?: string, userName?: string) =>
    `Уважаемый пользователь${
      ' ' + (userName || '')
    }. Вам направлено приглашение для регистрации в личном кабинете something CUBE от пользователя${
      ' ' + (name || '')
    }. <br/>Для регистрации в ЛК и получения доступа к личному кабинету, перейдите по <a href="${url}">ссылке</a>. Если Вы не планируете регистрироваться в Личном кабинете, перейдите по <a href="${discardUrl}">ссылке</a>`,
  createRoute: (uName: string, routeName = '', date = '', admin = false) =>
    `Здравствуйте${' ' + uName || ''}.
    <br/> Маршрут ${routeName}, ${admin ? '' : 'где вы назначены ответственным, '}был создан.
    ${date ? '<br/><br/> Планируемая дата ' + date : ''}`,
  doneRoute: (uName: string, routeName: string, url: string) =>
    `Здравствуйте${
      ' ' + uName || ''
    }.<br/> Маршрут ${routeName} был выполнен.<br/> Ссылка на маршрут: <a href="${url}">Ссылка</a>`,
  overdueRoute: (uName: string, routeName: string, url: string) =>
    `Здравствуйте${
      ' ' + uName || ''
    }.<br/> Маршрут ${routeName} был просрочен.<br/> Ссылка на маршрут: <a href="${url}">Ссылка</a>`,
  forgotPassword: (url: string) =>
    `Здравствуйте.<br/> Пройдите по ссылке для восстановления пароля:<br/> <a href="${url}">Ссылка</a>`,
}

export const smsTemplate = {
  createRoute: (uName: string, routeName = '', date = '', admin = false) =>
    `Здравствуйте${' ' + uName || ''}. Маршрут ${routeName}, ${
      admin ? '' : 'где вы назначены ответственным, '
    }был создан. ${date ? 'Планируемая дата: ' + date : ''}`,
  confirmEmail: (url: string) =>
    `Здравствуйте. Мы получили запрос на регистрацию в личном кабинете something Cube. Пожалуйста, пройдите по ссылке для завершения регистрации: ${url}`,
  inviteUser: (url: string, name: string) =>
    `Уважаемый пользователь. Вам направлено приглашение для регистрации в личном кабинете something CUBE от пользователя ${
      name || ''
    }. Для регистрации в ЛК и получения доступа к личному кабинету, перейдите по ссылке: ${url}`,
}

export enum Path {
  IMG = './tmp/uploads/',
}

export enum IMAGE_NAME {
  PRODUCT = 'product',
  INGREDIENT = 'ingredient',
}

export enum OrganizationsPartnerStatus {
  PLANNED = 'planned',
  PERFORMED = 'performed',
  DONE = 'done',
  DRAFT = 'draft',
}
export enum Bank {
  PSB = 1,
  MTS = 2,
  VTB = 3,
}

export const redisKey = {
  updateEmail: (userId: number) => `${userId}:email:update`,
}

export enum PaymentService {
  TOCAN = 'tocan',
  WEBMONEY = 'webmoney',
}

export const TAX_SYSTEMS = [
  { value: 1, label: 'ОСН', orangeDataValue: 0 },
  { value: 2, label: 'УСН доход', orangeDataValue: 1 },
  { value: 4, label: 'УСН доход минус расход', orangeDataValue: 2 },
  { value: 8, label: 'ЕНВД', orangeDataValue: 3 },
  { value: 16, label: 'ЕСХН', orangeDataValue: 4 },
  { value: 32, label: 'ПСН', orangeDataValue: 5 },
]

export const PAYMENT_TYPES = {
  0: 'Наличные',
  1: 'Безналичные',
}

export const RECEIPT_EXPORT_COLUMNS = (type) =>
  [
    { header: 'Идентификатор', key: 'id', width: 32 },
    { header: 'Статус фискализации', key: 'fiscalizationStatus', width: 32 },
    { header: 'Торговая точка', key: 'calculationAddress', width: 32 },
    { header: 'ЗН ККТ', key: 'deviceSN', width: 32 },
    { header: 'Автомат', key: 'automat', width: 32 },
    { header: 'Дата', key: 'processedAtDate', width: 32 },
    { header: 'Время', key: 'processedAtTime', width: 32 },
    { header: 'Тип операции', key: 'operation', width: 32 },
    { header: 'ИНН', key: 'companyINN', width: 32 },
    { header: 'РН ККТ', key: 'deviceRN', width: 32 },
    { header: 'ФН', key: 'fsNumber', width: 32 },
    { header: '№ чека', key: 'documentIndex', width: 32 },
    type !== 'simple' && { header: 'Список позиций', key: 'positions', width: 150 },
    { header: 'Итог по чеку', key: 'amount', width: 32 },
    { header: 'Способ оплаты', key: 'paymentTypes', width: 32 },
    { header: 'Процент НДС', key: 'taxValues', width: 32 },
    { header: 'Сумма НДС', key: 'taxAmounts', width: 32 },
    { header: 'СНО', key: 'taxationSystem', width: 32 },
    { header: 'ФД', key: 'documentNumber', width: 32 },
    { header: 'ФП', key: 'fp', width: 32 },
    type === 'full' && { header: 'Доп. параметры чека', key: 'ffdFields', width: 64 },
  ].filter(Boolean)

export const TAX_RATES = (date = moment()) => [
  {
    value: '1',
    rate: is2019(date) ? 20 / 120 : 18 / 118,
    label: is2019(date) ? '20%' : '18%',
    letter: 'А',
  },
  { value: '2', rate: 10 / 110, label: '10%', letter: 'Б' },
  {
    value: '3',
    rate: is2019(date) ? 20 / 120 : 18 / 118,
    label: `Расч. ${is2019(date) ? '20/120' : '18/118'}`,
    letter: 'Д',
  },
  { value: '4', rate: 10 / 110, label: 'Расч. 10/110', letter: 'Е' },
  { value: '5', rate: 0, label: '0%', letter: 'В' },
  { value: '6', rate: 0, label: 'Не облагается', letter: 'Г' },
]

export const RECEIPT_STATUSES = [
  { value: 1, label: 'В очереди' },
  { value: 2, label: 'Отправлен' },
  { value: 3, label: 'Фискализирован' },
  { value: 4, label: 'Ошибка' },
]

export const RECEIPT_OPERATIONS = [
  { value: 1, label: 'Приход' },
  { value: 2, label: 'Возврат прихода' },
  { value: 3, label: 'Расход' },
  { value: 4, label: 'Возврат расхода' },
]

export const POSITION_LIST_COLUMN_DESCRIPTION =
  'наименование товара, количество предмета расчета, цена до применения скидок, стоимость единицы предмета расчета, ставка НДС, способ расчета, тип предмета расчета, непреобразованное значение считанного сканером кода товарной номенклатуры, код товарной номенклатуры, наименование поставщика, телефон поставщика, ИНН поставщика, тип агента, операция платежного агента, наименование оператора перевода, адрес оператора перевода, ИНН оператора перевода, телефон оператора перевода, телефон платежного агента, телефон оператора по приему платежей, дополнительный реквизит предмета расчета, код страны происхождения товара, номер таможенной декларации, акциз'
export const CUSTOM_PROPERTIES_COLUMN_DESCRIPTION =
  'тип агента, телефон оператора перевода, телефон платежного агента, телефон оператора по приему платежей, телефон поставщика, наименование оператора перевода, адрес оператора перевода, ИНН оператора перевода, дополнительный реквизит чека (БСО), наименование доп. реквизит пользователя, значение доп. реквизита пользователя'

export enum FiscalizationStatus {
  IN_PROCESS = 1,
  TO_FISCALIZATION = 2,
  COMPLETE = 3,
  ERROR = 4,
  RESEND_TO_FISCALIZATION = 5,
}

export const PIN_EXPIRATION_TIME = moment.duration(7, 'days')
export const PIN_DELETE_TIME = moment.duration(1, 'years')
