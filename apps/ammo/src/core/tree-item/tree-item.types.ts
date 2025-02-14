export interface ITreeItemLine {
    isLast: boolean;
    isVisible: boolean;
}

export interface ITreeItemProps {
    deep: number;
    lines: ITreeItemLine[];
    isClassItem: boolean;
    isSection: boolean;
    isClass: boolean;
    title: string;
    arrow?: boolean;
    onPress: () => void;
    state?: 'active' | 'default';
}
