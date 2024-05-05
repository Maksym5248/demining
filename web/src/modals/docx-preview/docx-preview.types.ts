export interface DocxPreviewModalProps {
    id?: string;
    isVisible: boolean;
    hide: () => void;

    file: File;
    name: string;
}