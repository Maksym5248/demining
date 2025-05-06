import { type ICommentsModel } from '~/models';

export interface ICommentsPreviewProps {
    item: ICommentsModel;
    onMeasure?: (size: { x: number; y: number; width: number; height: number; pageX: number; pageY: number }) => void;
}
