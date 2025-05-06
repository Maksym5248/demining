import { type IExplosiveDevice } from 'shared-my-client';

import { type ICharacteristicModel } from '../../models';

export interface ICharacteristicProps {
    item?: IExplosiveDevice;
    characteristic: ICharacteristicModel;
}
