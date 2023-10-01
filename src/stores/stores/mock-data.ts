import { RANKS} from "~/constants"

export const mockEmployees = [0,1,2,3,4,5,6,7,8,9,10].map((el, index) => ({
    firstName: "Максим",
    lastName: "Костін",
    surname: "Юрійович",
    rank: RANKS.SENIOR_LIEUTENANT,
    position: "Начальник відділення",
}))