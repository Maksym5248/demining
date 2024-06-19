import { type DOCUMENT_TYPE } from '@/shared/db';

export interface IDocumentForm {
    name: string;
    documentType: DOCUMENT_TYPE;
}
