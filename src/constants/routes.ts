export enum ROUTES {
    MISSION_REQUEST_LIST ="/mission-request-list",
    ORDER_LIST ="/order-list",
    MISSION_REPORT_LIST ="/mission-report",
    EMPLOYEES_LIST ="/employees-list",
    EXPLOSIVE_OBJECT_LIST ="/explosive-object-list",
    TRANSPORT_LIST ="/transport-list",
    EQUIPMENT_LIST ="/equipment-list",
	SETTINGS = "/settings",

	ORGANIZATIONS_LIST = "/organization-list",

	AUTH ="/login",
	SIGNUP ="/signup",
	WAITING_APPROVE ="/waiting-approve",
}

export const routesInfo = {
	[ROUTES.MISSION_REPORT_LIST]: {
		title: "Виїзд",
	},
	[ROUTES.MISSION_REQUEST_LIST]: {
		title: "Заявки",
	},
	[ROUTES.EMPLOYEES_LIST]: {
		title: "Особовий склад",
	},
	[ROUTES.ORDER_LIST]: {
		title: "Накази",
	},
	[ROUTES.EXPLOSIVE_OBJECT_LIST]: {
		title: "ВНП",
	},
	[ROUTES.TRANSPORT_LIST]: {
		title: "Транспорт",
	},
	[ROUTES.EQUIPMENT_LIST]: {
		title: "Обладнання",
	},
	[ROUTES.SETTINGS]: {
		title: "Налаштування",
	},
	[ROUTES.ORGANIZATIONS_LIST]: {
		title: "Організації",
	},
	[ROUTES.AUTH]: {
		title: "Увійти",
	},
	[ROUTES.SIGNUP]: {
		title: "Зареєструватись",
	},
	[ROUTES.WAITING_APPROVE]: {
		title: "Очікування підтвердження",
	},
}