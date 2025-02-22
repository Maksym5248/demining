interface Item {
    title: string | number;
    text?: string | number;
    onPress?: () => void;
}

export interface IFieldListProps {
    label: string;
    items?: Item[] | null;
    info?: string;
    type?: 'vertical' | 'horizontal';
    splitter?: string;
    splitterItem?: string;
}
