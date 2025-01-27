import { type ITextStyle } from '~/types';

export interface ILabelProps {
    isSmall: boolean;
    text: string;
    style?: ITextStyle;
    paddingLeft?: { value: number };
}
