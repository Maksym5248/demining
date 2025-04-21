export enum ROUTES {
    // documents
    HOME = '/home',
    MISSION_REQUEST_LIST = '/mission-request-list',
    ORDER_LIST = '/order-list',
    MISSION_REPORT_LIST = '/mission-report',
    EMPLOYEES_LIST = '/employees-list',
    TRANSPORT_LIST = '/transport-list',
    EQUIPMENT_LIST = '/equipment-list',
    SETTINGS = '/settings',
    TEMPLATES = '/templates',
    STATISTICS = '/statistics',

    // Managment
    ORGANIZATIONS_LIST = '/organization-list',
    MEMBERS_LIST = '/organization-list/:organizationId/members-list',
    USERS_LIST = '/users-list',

    // Auth
    LOGIN = '/login',
    SIGNUP = '/signup',
    WAITING_APPROVE = '/waiting-approve',

    // Common
    NOT_FOUND = '/not-found',
    DEV = '/dev',

    // Dictionary
    EXPLOSIVE_LIST = '/explosive-list',
    EXPLOSIVE_OBJECT_LIST = '/explosive-object-list',
    EXPLOSIVE_DEVICE_LIST = '/explosive-device-list',
    EXPLOSIVE_OBJECT_TYPE = '/types',
    EXPLOSIVE_OBJECT_CLASS = '/class',
    EXPLOSIVE_OBJECT_CLASS_ITEM = '/types/class-items/:id',
    BOOKS_LIST = '/books-list',
}

export enum SECTION {
    MANAGMENT = 'managment',
    DOCUMENTS = 'documents',
    DICTIONARY = 'dictionary',
    DEV = 'dev',
}

export const routesGroups: Record<SECTION, ROUTES[]> = {
    [SECTION.MANAGMENT]: [ROUTES.ORGANIZATIONS_LIST, ROUTES.MEMBERS_LIST, ROUTES.USERS_LIST],
    [SECTION.DOCUMENTS]: [
        ROUTES.HOME,
        ROUTES.MISSION_REQUEST_LIST,
        ROUTES.ORDER_LIST,
        ROUTES.MISSION_REPORT_LIST,
        ROUTES.BOOKS_LIST,
        ROUTES.TRANSPORT_LIST,
        ROUTES.EQUIPMENT_LIST,
        ROUTES.EMPLOYEES_LIST,
        ROUTES.TEMPLATES,
        ROUTES.STATISTICS,
        ROUTES.SETTINGS,
    ],
    [SECTION.DICTIONARY]: [
        ROUTES.EXPLOSIVE_LIST,
        ROUTES.EXPLOSIVE_OBJECT_LIST,
        ROUTES.EXPLOSIVE_DEVICE_LIST,
        ROUTES.EXPLOSIVE_OBJECT_TYPE,
        ROUTES.EXPLOSIVE_OBJECT_CLASS,
        ROUTES.EXPLOSIVE_OBJECT_CLASS_ITEM,
        ROUTES.BOOKS_LIST,
    ],
    [SECTION.DEV]: [ROUTES.DEV],
};

export const routesInfo = {
    [ROUTES.HOME]: {
        title: 'Карта',
    },
    [ROUTES.STATISTICS]: {
        title: 'Статистика',
    },
    [ROUTES.MISSION_REPORT_LIST]: {
        title: 'Виїзд',
    },
    [ROUTES.MISSION_REQUEST_LIST]: {
        title: 'Підстава',
    },
    [ROUTES.EMPLOYEES_LIST]: {
        title: 'Особовий склад',
    },
    [ROUTES.ORDER_LIST]: {
        title: 'Накази',
    },
    [ROUTES.EXPLOSIVE_DEVICE_LIST]: {
        title: 'ВР та ЗП',
    },
    [ROUTES.EXPLOSIVE_OBJECT_LIST]: {
        title: 'ВНП',
    },
    [ROUTES.TRANSPORT_LIST]: {
        title: 'Транспорт',
    },
    [ROUTES.EQUIPMENT_LIST]: {
        title: 'Обладнання',
    },
    [ROUTES.SETTINGS]: {
        title: 'Налаштування',
    },
    [ROUTES.ORGANIZATIONS_LIST]: {
        title: 'Організації',
    },
    [ROUTES.TEMPLATES]: {
        title: 'Шаблони',
    },
    [ROUTES.MEMBERS_LIST]: {
        title: 'Учасники',
    },
    [ROUTES.USERS_LIST]: {
        title: 'Користувачі',
    },
    [ROUTES.LOGIN]: {
        title: 'Увійти',
    },
    [ROUTES.SIGNUP]: {
        title: 'Зареєструватись',
    },
    [ROUTES.EXPLOSIVE_OBJECT_TYPE]: {
        title: 'Типи',
    },
    [ROUTES.EXPLOSIVE_OBJECT_CLASS]: {
        title: 'Класифікація',
    },
    [ROUTES.EXPLOSIVE_OBJECT_CLASS_ITEM]: {
        title: 'Класифікація',
    },
    [ROUTES.BOOKS_LIST]: {
        title: 'Книги',
    },
    [ROUTES.EXPLOSIVE_LIST]: {
        title: 'ВР речовини',
    },
    [ROUTES.WAITING_APPROVE]: {
        title: 'Очікування підтвердження',
    },
    [ROUTES.NOT_FOUND]: {
        title: 'Сторінку не знайдено',
    },
    [ROUTES.DEV]: {
        title: 'Debug',
    },
};

export enum SEARCH_PARAMS {
    SEARCH_BY = 'searchBy',
}
