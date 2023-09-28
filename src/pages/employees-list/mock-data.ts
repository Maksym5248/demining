import { RANKS} from "~/constants"

export const mockData = [0,1,2,3,4,5,6,7,8,9,10].map((el, index) => ({
    id: index,
    firstName: "Максим",
    lastName: "Костін",
    surname: "Юрійович",
    rank: {
        id: RANKS.SENIOR_LIEUTENANT,
        fullName: 'старший лейтенант',
        shortName: 'ст. л-т',
        rank: RANKS.SENIOR_LIEUTENANT,
    },
    position: "Начальник відділення",
}))