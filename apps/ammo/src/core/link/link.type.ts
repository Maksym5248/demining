import { type ITextProps } from '../text';

export interface ILinkProps extends ITextProps {
    text: string;
    arrow: boolean;
    onPress: () => void;
}
