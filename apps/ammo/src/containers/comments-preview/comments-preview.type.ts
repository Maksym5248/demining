import { type LayoutChangeEvent } from 'react-native';

export interface ICommentsPreviewProps {
    isComments: boolean;
    onLayout?: (event: LayoutChangeEvent) => void;
}
