import { type IModalView } from 'shared-my-client';

export interface IExplosiveObjectClassificationModalProps extends IModalView {
    typeId: string;
    classItemId?: string;
    onSelect: (id: string) => void;
}
