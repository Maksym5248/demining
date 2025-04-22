import { type MATERIAL } from 'shared-my';

import { type IMaterialDTO } from '~/api';

export interface IMaterialData {
    id: MATERIAL;
    name: string;
}

export const createMaterial = (value: IMaterialDTO): IMaterialData => ({
    id: value.id,
    name: value.name,
});
