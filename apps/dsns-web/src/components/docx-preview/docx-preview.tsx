import { MIME_TYPE } from '@/shared/db';
import { fileUtils, useAsyncEffect } from '@/shared-client/common';
import * as docx from 'docx-preview';

import { Crashlytics } from '~/services';

interface DocxPreviewProps {
    file: File | null;
}

export function DocxPreview({ file }: DocxPreviewProps) {
    useAsyncEffect(async () => {
        if (!file) {
            return;
        }

        try {
            await docx.renderAsync(
                fileUtils.fileToBlob(file, MIME_TYPE.DOCX),
                document.getElementById('docx-preview-component') as HTMLElement,
            );
        } catch (e) {
            Crashlytics.error('DocxPreview - renderAsync: ', e);
        }
    }, [file]);

    return <div id="docx-preview-component" />;
}
