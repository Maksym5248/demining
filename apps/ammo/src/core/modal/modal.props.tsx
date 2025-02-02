import { type ModalProps } from 'react-native-modal';
import { type IModalView } from 'shared-my-client';

export interface IModalProps extends Partial<Omit<ModalProps, 'isVisible'>>, IModalView {}
