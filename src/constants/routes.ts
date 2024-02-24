export enum ROUTES {
    MISSION_REQUEST_LIST ="/mission-request-list",
    ORDER_LIST ="/order-list",
    MISSION_REPORT_LIST ="/",
	AUTH ="/",
    EMPLOYEES_LIST ="/employees-list",
    EXPLOSIVE_OBJECT_LIST ="/explosive-object-list",
    TRANSPORT_LIST ="/transport-list",
    EQUIPMENT_LIST ="/equipment-list",
	SETTINGS = "/settings"
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
}