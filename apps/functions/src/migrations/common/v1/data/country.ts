import { type ICountryDB } from 'shared-my';

export const countries: Pick<ICountryDB, 'id' | 'name'>[] = [
    {
        id: 'UKRAINE',
        name: 'Україна',
    },
    {
        id: 'SSSR',
        name: 'СССР',
    },
    {
        id: 'Russia',
        name: 'Росія',
    },
    {
        id: 'USA',
        name: 'США',
    },
    {
        id: 'POLAND',
        name: 'Польща',
    },
    {
        id: 'FRANCE',
        name: 'Франція',
    },
    {
        id: 'GreatBritain',
        name: 'Великобританія',
    },
    {
        id: 'Germany',
        name: 'Німеччина',
    },
];
