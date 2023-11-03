export enum ROUTES {
    // MISSION_REQUEST_LIST ="/mission-request-list",
    // ORDER_LIST ="/order-list",
    MISSION_REPORT_LIST ="/mission-reports-list",
    EMPLOYEES_LIST ="/employees-list",
    // TRANSPORT_LIST ="/transport-list",
    // EQUIPMENT_LIST ="/equipment-list",
}

export const routesInfo = {
    [ROUTES.MISSION_REPORT_LIST]: {
        title: "Акти виконаних робіт",
    },
    [ROUTES.EMPLOYEES_LIST]: {
        title: "Особовий склад",
    },
}