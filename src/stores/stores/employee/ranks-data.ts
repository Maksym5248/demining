import { RANKS } from "~/constants";

import { createRank } from './entities';

export const ranksData = [
	createRank({
		id: RANKS.PRIVATE,
		fullName: 'рядовий',
		shortName: 'рядовий',
		rank: RANKS.PRIVATE,
	}),
	createRank({
		id: RANKS.SERGEANT,
		fullName: 'сержант',
		shortName: 'с-т',
		rank: RANKS.SERGEANT,
	}),
	createRank({
		id: RANKS.MASTER_SERGEANT,
		fullName: 'майстер-сержант',
		shortName: 'майстер-сержант',
		rank: RANKS.MASTER_SERGEANT,
	}),
	createRank({
		id: RANKS.CHIEF_MASTER_SERGEANT,
		fullName: 'головний майстер-сержант',
		shortName: 'головний майстер-сержант',
		rank: RANKS.CHIEF_MASTER_SERGEANT,
	}),
	createRank({
		id: RANKS.JUNIOR_LIEUTENANT,
		fullName: 'молодший лейтенант',
		shortName: 'мол. л-т',
		rank: RANKS.JUNIOR_LIEUTENANT,
	}),
	createRank({
		id: RANKS.LIEUTENANT,
		fullName: 'лейтенант',
		shortName: 'л-т',
		rank: RANKS.LIEUTENANT,
	}),
	createRank({
		id: RANKS.SENIOR_LIEUTENANT,
		fullName: 'старший лейтенант',
		shortName: 'ст. л-т',
		rank: RANKS.SENIOR_LIEUTENANT,
	}),
	createRank({
		id: RANKS.CAPTAIN,
		fullName: 'капітан',
		shortName: 'к-н',
		rank: RANKS.CAPTAIN,
	}),
	createRank({
		id: RANKS.MAJOR,
		fullName: 'майор',
		shortName: 'м-р',
		rank: RANKS.MAJOR,
	}),
	createRank({
		id: RANKS.LIEUTENANT_COLONEL,
		fullName: 'підполковник',
		shortName: 'п/п-к',
		rank: RANKS.LIEUTENANT_COLONEL,
	}),
	createRank({
		id: RANKS.COLONEL,
		fullName: 'полковник',
		shortName: 'п-к',
		rank: RANKS.COLONEL,
	}),
]