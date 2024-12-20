export enum ROUTES {
    HOME = '/home',
    MISSION_REQUEST_LIST = '/mission-request-list',
    ORDER_LIST = '/order-list',
    MISSION_REPORT_LIST = '/mission-report',
    EMPLOYEES_LIST = '/employees-list',
    EXPLOSIVE_OBJECT_LIST = '/explosive-object-list',
    EXPLOSIVE_LIST = '/explosive-list',
    TRANSPORT_LIST = '/transport-list',
    EQUIPMENT_LIST = '/equipment-list',
    SETTINGS = '/settings',
    TEMPLATES = '/templates',
    STATISTICS = '/statistics',

    ORGANIZATIONS_LIST = '/organization-list',
    MEMBERS_LIST = '/organization-list/:organizationId/members-list',
    MY_ORGANIZATION = '/my-organization',

    LOGIN = '/login',
    SIGNUP = '/signup',
    WAITING_APPROVE = '/waiting-approve',

    NOT_FOUND = '/not-found',

    CLASSIFICATIONS_LIST = '/classifications-list',
    EXPLOSIVE_OBJECT_TYPES_LIST = '/explosive-object-types-list',
}

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
    [ROUTES.EXPLOSIVE_LIST]: {
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
    [ROUTES.MY_ORGANIZATION]: {
        title: 'Учасники',
    },
    [ROUTES.LOGIN]: {
        title: 'Увійти',
    },
    [ROUTES.SIGNUP]: {
        title: 'Зареєструватись',
    },
    [ROUTES.EXPLOSIVE_OBJECT_TYPES_LIST]: {
        title: 'Класифікація',
    },
    [ROUTES.CLASSIFICATIONS_LIST]: {
        title: 'Класифікація',
    },
    [ROUTES.WAITING_APPROVE]: {
        title: 'Очікування підтвердження',
    },
    [ROUTES.NOT_FOUND]: {
        title: 'Сторінку не знайдено',
    },
};

export enum SEARCH_PARAMS {
    SEARCH_BY = 'searchBy',
}
