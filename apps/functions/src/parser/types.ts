export interface ExtractedImage {
    id: string;
    filename: string;
    page: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface TextItem {
    text: string;
    fontSize?: number;
    color?: string;
    newLine?: boolean;
    imageName?: string; // Reference to an image if this text item is associated with one
}

export interface HighlightItem {
    text: string;
    quadPoints: number[][];
}

export interface ExtractedText {
    page: number;
    textItems: TextItem[];
    images: ExtractedImage[];
    highlights: HighlightItem[];
}

export interface ParsedPDF {
    metadata: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string[];
    };
    pages: ExtractedText[];
    viewport?: { width: number; height: number; widthMM?: number; heightMM?: number };
}
