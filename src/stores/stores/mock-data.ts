import { RANKS, EMPLOYEE_TYPE } from "~/constants"

export const mockEmployees = [{
    firstName: "Андрій",
    lastName: "Кочан",
    surname: "Юрійович",
    rank: RANKS.COLONEL,
    type: EMPLOYEE_TYPE.CHIEF,
    position: "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій полковник служби цивільного захисту",
}, {
    firstName: "Максим",
    lastName: "Костін",
    surname: "Юрійович",
    rank: RANKS.SENIOR_LIEUTENANT,
    type: EMPLOYEE_TYPE.SQUAD_LEAD,
    position: "Начальник відділення",
}, {
    firstName: "Ян",
    lastName: "Пушкар",
    surname: "Іванович",
    rank: RANKS.SENIOR_LIEUTENANT,
    type: EMPLOYEE_TYPE.SQUAD_LEAD,
    position: "Начальник відділення",
}, {
    firstName: "Руслан",
    lastName: "Данчук",
    surname: "Іванович",
    rank: RANKS.MASTER_SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Старший сапер",
}, {
    firstName: "Віталій",
    lastName: "Клименко",
    surname: "Васильович",
    rank: RANKS.MASTER_SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Cапер",
}, {
    firstName: "Ігор",
    lastName: "Кондратюк",
    surname: "Ігорович",
    rank: RANKS.SERGEANT,
    type: EMPLOYEE_TYPE.WORKER,
    position: "Водій",
}]