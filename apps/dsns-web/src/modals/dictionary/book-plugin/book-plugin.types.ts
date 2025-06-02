export interface Tab {
    key: string;
    label: string;
    children: React.ReactNode;
}

export interface BookPluginProps {
    id?: string;
    isVisible: boolean;
    hide: () => void;
}
