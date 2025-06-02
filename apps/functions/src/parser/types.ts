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

export interface PositionedTextItem extends TextItem {
    y?: number;
    x?: number;
    newParagraph?: boolean;
    offsetX?: number;
    originalIndex?: number; // Preserve original index for HTML generation
    fontName?: string; // Add fontName for font extraction
    fontWeight?: string | number; // Add fontWeight for style extraction
    fontStyle?: string; // Add fontStyle for style extraction
}
