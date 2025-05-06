import { type IExplosive } from 'shared-my-client';

import { type IDetailsModel } from '../../models';

export interface IDetailsProps {
    item?: IExplosive;
    details: IDetailsModel;
}
