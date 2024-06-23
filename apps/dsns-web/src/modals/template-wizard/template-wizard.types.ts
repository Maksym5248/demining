import { type DOCUMENT_TYPE } from 'shared-my/db';

export interface IDocumentForm {
    name: string;
    documentType: DOCUMENT_TYPE;
}
