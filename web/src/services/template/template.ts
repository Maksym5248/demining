import {
    TemplateHandler,
    ImagePlugin,
    LinkPlugin,
    LoopPlugin,
    TextPlugin,
    RawXmlPlugin,
} from 'easy-template-x';

import { MIME_TYPE } from '~/constants';
import { fileUtils } from '~/utils/file';

const handler = new TemplateHandler({
    plugins: [
        new LoopPlugin(),
        new RawXmlPlugin(),
        new ImagePlugin(),
        new LinkPlugin(),
        new TextPlugin(),
    ],
    maxXmlDepth: 30,
});

interface DocxImage {
    _type: string;
    source: Blob;
    format: string;
    altText: string;
    width: number;
    height: number;
}

async function generateFile(template: File, data: { [key: string]: string | number | DocxImage }) {
    const blob = await fileUtils.fileToBlob(template, MIME_TYPE.DOCX);
    return handler.process(blob, data);
}

export const Template = {
    generateFile,
};
