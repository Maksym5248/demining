export enum ROUTES {
    MISSION_REPORT_LIST ="/mission-reports-list",
    MISSION_REPORT_CREATE ="/mission-reports-list/create",
    EMPLOYEES_LIST ="/employees-list",
    EMPLOYEES_CREATE ="/employees-list/create",
    EMPLOYEES_EDIT ="/employees-list/edit/:id",
}

export const routesInfo = {
    [ROUTES.MISSION_REPORT_LIST]: {
        title: "Cписок актів",
    },
    [ROUTES.MISSION_REPORT_CREATE]: {
        title: "Створити",
    },
    [ROUTES.EMPLOYEES_LIST]: {
        title: "Особовий склад",
    },
    [ROUTES.EMPLOYEES_CREATE]: {
        title: "Додати",
    },
    [ROUTES.EMPLOYEES_EDIT]: {
        title: "Редагувати дані",
    },
}